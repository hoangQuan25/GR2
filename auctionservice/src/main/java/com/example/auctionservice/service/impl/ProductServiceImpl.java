package com.example.auctionservice.service.impl;

import com.example.auctionservice.entity.Product;
import com.example.auctionservice.repository.ProductRepository;
import com.example.auctionservice.service.ProductService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product createProduct(Product product) {
        product.setCreatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }

    public Product updateProduct(Long productId, Product updated) {
        return productRepository.findById(productId).map(prod -> {
            prod.setTitle(updated.getTitle());
            prod.setDescription(updated.getDescription());
            prod.setCategory(updated.getCategory());
            prod.setEstimatedPriceMin(updated.getEstimatedPriceMin());
            prod.setEstimatedPriceMax(updated.getEstimatedPriceMax());
            prod.setImageData(updated.getImageData());
            prod.setUpdatedAt(LocalDateTime.now());
            return productRepository.save(prod);
        }).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public List<Product> getMyProducts(Long ownerId) {
        // In real scenario you'd do a custom query or filter
        // For example, productRepository.findByOwnerId(ownerId);
        // but let's do a simple approach:
        return productRepository.findAll()
                .stream()
                .filter(p -> p.getOwnerId().equals(ownerId))
                .toList();
    }

    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
    }

    public Optional<Product> getProduct(Long productId) {
        return productRepository.findById(productId);
    }
}
