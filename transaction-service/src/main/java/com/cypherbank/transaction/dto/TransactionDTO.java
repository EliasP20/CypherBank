package com.cypherbank.transaction.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionDTO {
    private Long id;
    private String type;
    private BigDecimal amount;
    private String fromUserEmail;
    private String toUserEmail;
    private LocalDateTime timestamp;

    public TransactionDTO() {}

    public TransactionDTO(Long id, String type, BigDecimal amount, String fromUserEmail, String toUserEmail, LocalDateTime timestamp) {
        this.id = id;
        this.type = type;
        this.amount = amount;
        this.fromUserEmail = fromUserEmail;
        this.toUserEmail = toUserEmail;
        this.timestamp = timestamp;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getFromUserEmail() {
        return fromUserEmail;
    }

    public void setFromUserEmail(String fromUserEmail) {
        this.fromUserEmail = fromUserEmail;
    }

    public String getToUserEmail() {
        return toUserEmail;
    }

    public void setToUserEmail(String toUserEmail) {
        this.toUserEmail = toUserEmail;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}




