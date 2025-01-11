package com.example.auctionservice.service;

import com.example.auctionservice.entity.Product;

import java.util.List;
import java.util.Optional;

public interface ProductService {

    Product createProduct(Product product);

    Product updateProduct(Long productId, Product updated);

    List<Product> getMyProducts(Long ownerId);

    void deleteProduct(Long productId);

    Optional<Product> getProduct(Long productId);
}
