package com.example.auctionservice.controller;

import com.example.auctionservice.entity.Product;
import com.example.auctionservice.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * REST Controller for managing Products.
 * Supports adding/updating with optional image upload as multipart/form-data.
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    /**
     * Create a new Product (with optional image).
     * Expects multipart/form-data with fields:
     *  - ownerId
     *  - ownerName
     *  - title
     *  - description
     *  - estimatedPriceMin
     *  - estimatedPriceMax
     *  - imageFile (optional)
     */
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Product> createProduct(
            @RequestParam("ownerId") Long ownerId,
            @RequestParam(value = "ownerName", required = false) String ownerName,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("estimatedPriceMin") Double estimatedPriceMin,
            @RequestParam("estimatedPriceMax") Double estimatedPriceMax,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile
    ) throws IOException {

        Product product = new Product();
        product.setOwnerId(ownerId);
        product.setOwnerName(ownerName);
        product.setTitle(title);
        product.setDescription(description);
        product.setEstimatedPriceMin(estimatedPriceMin);
        product.setEstimatedPriceMax(estimatedPriceMax);

        if (imageFile != null && !imageFile.isEmpty()) {
            product.setImageData(imageFile.getBytes());
        }

        Product savedProduct = productService.createProduct(product);
        return ResponseEntity.ok(savedProduct);
    }

    /**
     * Update an existing product (with optional new image).
     * Expects multipart/form-data with possible fields:
     *  - title
     *  - description
     *  - estimatedPriceMin
     *  - estimatedPriceMax
     *  - imageFile (optional)
     */
    @PutMapping(value = "/{productId}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long productId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("estimatedPriceMin") Double estimatedPriceMin,
            @RequestParam("estimatedPriceMax") Double estimatedPriceMax,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile
    ) throws IOException {

        Product updatedProduct = new Product();
        updatedProduct.setTitle(title);
        updatedProduct.setDescription(description);
        updatedProduct.setEstimatedPriceMin(estimatedPriceMin);
        updatedProduct.setEstimatedPriceMax(estimatedPriceMax);

        if (imageFile != null && !imageFile.isEmpty()) {
            updatedProduct.setImageData(imageFile.getBytes());
        }

        Product saved = productService.updateProduct(productId, updatedProduct);
        return ResponseEntity.ok(saved);
    }

    /**
     * Fetch a single Product by ID.
     */
    @GetMapping("/{productId}")
    public ResponseEntity<Product> getProduct(@PathVariable Long productId) {
        return productService.getProduct(productId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a Product by ID.
     */
    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Return a list of Products owned by a particular user (ownerId).
     */
    @GetMapping("/user/{ownerId}")
    public ResponseEntity<List<Product>> getProductsForUser(@PathVariable Long ownerId) {
        List<Product> products = productService.getMyProducts(ownerId);
        return ResponseEntity.ok(products);
    }
}
