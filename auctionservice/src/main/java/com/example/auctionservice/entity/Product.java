package com.example.auctionservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long ownerId;
    private String ownerName;
    private String title;
    private String description;
    private String category;
    private Double estimatedPriceMin;
    private Double estimatedPriceMax;

    @Lob
    @JsonIgnore
    private byte[] imageData;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = false)
    @JsonIgnore
    private List<Auction> auctions = new ArrayList<>();

    // Return Base64 so the front end can easily display <img src="data:image/png;base64,...">
    @JsonProperty("imageData")
    public String getImageDataAsBase64() {
        if (imageData == null || imageData.length == 0) {
            return null;
        }
        return Base64.getEncoder().encodeToString(imageData);
    }
}
