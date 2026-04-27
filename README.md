# 🛒 LocalBiz — Complete API Documentation

> **AI-Powered Web Platform for Business and Customer Management**
> MERN Stack · JWT Auth · Role-Based Access Control
> Base URL: `https://api.localbiz.pk/api/v1`

---

## 📑 Table of Contents

1. [Authentication](#1-authentication)
2. [Customer Module](#2-customer-module)
3. [Store Discovery](#3-store-discovery)
4. [Products](#4-products)
5. [Cart](#5-cart)
6. [Orders](#6-orders)
7. [Payments](#7-payments)
8. [Returns](#8-returns)
9. [AI Recommendations](#9-ai-recommendations)
10. [Business Administrator Module](#10-business-administrator-module)
11. [Inventory Management](#11-inventory-management)
12. [Analytics & Reports (Business)](#12-analytics--reports-business)
13. [Super Administrator Module](#13-super-administrator-module)
14. [Category Management](#14-category-management)
15. [Platform Reports (Super Admin)](#15-platform-reports-super-admin)
16. [Notifications](#16-notifications)
17. [Invoices](#17-invoices)

---

## Global Headers

All protected routes require:

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

## Role Definitions

| Role Token Value | Description |
|---|---|
| `customer` | End user who browses and places orders |
| `business_admin` | Store owner / business manager |
| `super_admin` | Platform-level administrator |

## Standard Error Response

```json
{
  "success": false,
  "message": "Error description here",
  "error": "VALIDATION_ERROR | UNAUTHORIZED | NOT_FOUND | SERVER_ERROR"
}
```

---

## 1. Authentication

### 1.1 Register Customer

**POST** `/auth/register/customer`
**Access:** Public

**Request Body:**
```json
{
  "fullName": "Ahmed Raza",
  "email": "ahmed@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "city": "Lahore",
  "phone": "03001234567"
}
```

**Expected Response `201`:**
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "email": "ahmed@example.com",
    "emailVerified": false
  }
}
```

---

### 1.2 Register Business Owner

**POST** `/auth/register/business`
**Access:** Public

**Request Body:**
```json
{
  "fullName": "Usman Khan",
  "email": "usman@mystore.com",
  "password": "StorePass456!",
  "phone": "03211234567",
  "storeName": "Khan General Store",
  "storeCategory": "Grocery",
  "storeAddress": "Street 4, Block B, Gulberg III, Lahore",
  "storeCity": "Lahore",
  "storeDescription": "Fresh groceries and household items since 2005.",
  "storeLogo": "base64_encoded_image_string_or_url"
}
```

**Expected Response `201`:**
```json
{
  "success": true,
  "message": "Business registration submitted. Awaiting super admin approval.",
  "data": {
    "businessOwnerId": "64f1a2b3c4d5e6f7a8b9c0d2",
    "email": "usman@mystore.com",
    "approvalStatus": "pending"
  }
}
```

---

### 1.3 Login (All Roles)

**POST** `/auth/login`
**Access:** Public

**Request Body:**
```json
{
  "email": "ahmed@example.com",
  "password": "SecurePass123!"
}
```

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "role": "customer",
    "user": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "fullName": "Ahmed Raza",
      "email": "ahmed@example.com",
      "emailVerified": true,
      "avatar": "https://cdn.localbiz.pk/avatars/default.png"
    }
  }
}
```

---

### 1.4 Verify Email

**POST** `/auth/verify-email`
**Access:** Public

**Request Body:**
```json
{
  "email": "ahmed@example.com",
  "otp": "482913"
}
```

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "Email verified successfully.",
  "data": {
    "emailVerified": true
  }
}
```

---

### 1.5 Forgot Password

**POST** `/auth/forgot-password`
**Access:** Public

**Request Body:**
```json
{
  "email": "ahmed@example.com"
}
```

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "Password reset OTP sent to your email."
}
```

---

### 1.6 Reset Password

**POST** `/auth/reset-password`
**Access:** Public

**Request Body:**
```json
{
  "email": "ahmed@example.com",
  "otp": "739201",
  "newPassword": "NewPass789!",
  "confirmPassword": "NewPass789!"
}
```

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "Password reset successful. You can now log in."
}
```

---

### 1.7 Logout

**POST** `/auth/logout`
**Access:** All authenticated roles

**Headers:** `Authorization: Bearer <token>`

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

---

## 2. Customer Module

### 2.1 Get Customer Profile

**GET** `/customer/profile`
**Access:** `customer`

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "fullName": "Ahmed Raza",
    "email": "ahmed@example.com",
    "phone": "03001234567",
    "city": "Lahore",
    "avatar": "https://cdn.localbiz.pk/avatars/ahmed.png",
    "addresses": [
      {
        "addressId": "addr_001",
        "label": "Home",
        "street": "House 12, Street 4, Gulberg III",
        "city": "Lahore",
        "isDefault": true
      }
    ],
    "memberSince": "2024-09-01T00:00:00.000Z"
  }
}
```

---

### 2.2 Update Customer Profile

**PUT** `/customer/profile`
**Access:** `customer`

**Request Body:**
```json
{
  "fullName": "Ahmed Raza Updated",
  "phone": "03001112233",
  "city": "Lahore",
  "avatar": "base64_or_url"
}
```

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "Profile updated successfully.",
  "data": {
    "fullName": "Ahmed Raza Updated",
    "phone": "03001112233"
  }
}
```

---

### 2.3 Add Delivery Address

**POST** `/customer/addresses`
**Access:** `customer`

**Request Body:**
```json
{
  "label": "Office",
  "street": "3rd Floor, DHA Phase 5, Block C",
  "city": "Lahore",
  "isDefault": false
}
```

**Expected Response `201`:**
```json
{
  "success": true,
  "message": "Address added successfully.",
  "data": {
    "addressId": "addr_002",
    "label": "Office",
    "street": "3rd Floor, DHA Phase 5, Block C",
    "city": "Lahore",
    "isDefault": false
  }
}
```

---

### 2.4 Update Delivery Address

**PUT** `/customer/addresses/:addressId`
**Access:** `customer`

**Request Body:**
```json
{
  "label": "Office",
  "street": "4th Floor, DHA Phase 5, Block D",
  "city": "Lahore",
  "isDefault": true
}
```

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "Address updated successfully."
}
```

---

### 2.5 Delete Delivery Address

**DELETE** `/customer/addresses/:addressId`
**Access:** `customer`

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "Address removed successfully."
}
```

---

### 2.6 Change Password

**PUT** `/customer/change-password`
**Access:** `customer`

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewSecure456!",
  "confirmPassword": "NewSecure456!"
}
```

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "Password changed successfully."
}
```

---

### 2.7 Get Spending Insights

**GET** `/customer/insights`
**Access:** `customer`

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "totalOrders": 24,
    "spentThisMonth": 4850,
    "spentThisYear": 38200,
    "currency": "PKR",
    "monthlyBreakdown": [
      { "month": "Jan", "amount": 3200 },
      { "month": "Feb", "amount": 4100 },
      { "month": "Mar", "amount": 4850 }
    ],
    "topCategories": ["Grocery", "Beverages", "Household"]
  }
}
```

---

## 3. Store Discovery

### 3.1 Get Nearby Stores

**GET** `/stores?city=Lahore&category=Grocery&rating=4&page=1&limit=12`
**Access:** `customer`

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `city` | string | Filter by city |
| `category` | string | Filter by store category |
| `rating` | number | Minimum star rating (1–5) |
| `page` | number | Pagination page |
| `limit` | number | Results per page |

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "stores": [
      {
        "storeId": "store_001",
        "storeName": "Khan General Store",
        "category": "Grocery",
        "coverImage": "https://cdn.localbiz.pk/stores/khan.jpg",
        "logo": "https://cdn.localbiz.pk/logos/khan.png",
        "address": "Street 4, Block B, Gulberg III, Lahore",
        "city": "Lahore",
        "rating": 4.5,
        "totalReviews": 38,
        "distance": "0.8 km",
        "isOpen": true,
        "operatingHours": "08:00 - 22:00"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalStores": 58
    }
  }
}
```

---

### 3.2 Get Single Store Details

**GET** `/stores/:storeId`
**Access:** `customer`

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "storeId": "store_001",
    "storeName": "Khan General Store",
    "category": "Grocery",
    "description": "Fresh groceries and household items since 2005.",
    "coverImage": "https://cdn.localbiz.pk/stores/khan.jpg",
    "logo": "https://cdn.localbiz.pk/logos/khan.png",
    "address": "Street 4, Block B, Gulberg III, Lahore",
    "city": "Lahore",
    "phone": "03211234567",
    "rating": 4.5,
    "totalReviews": 38,
    "isOpen": true,
    "operatingHours": {
      "Monday": "08:00-22:00",
      "Tuesday": "08:00-22:00",
      "Wednesday": "08:00-22:00",
      "Thursday": "08:00-22:00",
      "Friday": "08:00-21:00",
      "Saturday": "09:00-21:00",
      "Sunday": "Closed"
    },
    "totalProducts": 142,
    "categories": ["Rice & Grains", "Beverages", "Dairy", "Household"]
  }
}
```

---

### 3.3 Get Products by Store

**GET** `/stores/:storeId/products?category=Dairy&page=1&limit=20`
**Access:** `customer`

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "storeId": "store_001",
    "storeName": "Khan General Store",
    "products": [
      {
        "productId": "prod_001",
        "name": "Olper's Milk 1L",
        "description": "Full cream UHT milk",
        "price": 180,
        "currency": "PKR",
        "image": "https://cdn.localbiz.pk/products/olpers.jpg",
        "category": "Dairy",
        "stockQty": 45,
        "inStock": true
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalProducts": 52
    }
  }
}
```

---

## 4. Products

### 4.1 Get Single Product Detail

**GET** `/products/:productId`
**Access:** `customer`

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "productId": "prod_001",
    "name": "Olper's Milk 1L",
    "description": "Full cream UHT milk, shelf-stable for 6 months.",
    "price": 180,
    "currency": "PKR",
    "images": [
      "https://cdn.localbiz.pk/products/olpers_1.jpg",
      "https://cdn.localbiz.pk/products/olpers_2.jpg"
    ],
    "category": "Dairy",
    "stockQty": 45,
    "inStock": true,
    "store": {
      "storeId": "store_001",
      "storeName": "Khan General Store",
      "rating": 4.5
    }
  }
}
```

---

## 5. Cart

### 5.1 Get Cart

**GET** `/cart`
**Access:** `customer`

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "cartId": "cart_abc123",
    "items": [
      {
        "cartItemId": "ci_001",
        "productId": "prod_001",
        "productName": "Olper's Milk 1L",
        "productImage": "https://cdn.localbiz.pk/products/olpers_1.jpg",
        "storeName": "Khan General Store",
        "storeId": "store_001",
        "unitPrice": 180,
        "quantity": 3,
        "subtotal": 540
      }
    ],
    "totalItems": 3,
    "totalAmount": 540,
    "currency": "PKR"
  }
}
```

---

### 5.2 Add Item to Cart

**POST** `/cart`
**Access:** `customer`

**Request Body:**
```json
{
  "productId": "prod_001",
  "quantity": 2
}
```

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "Item added to cart.",
  "data": {
    "cartItemId": "ci_001",
    "productId": "prod_001",
    "quantity": 2,
    "subtotal": 360
  }
}
```

---

### 5.3 Update Cart Item Quantity

**PUT** `/cart/:cartItemId`
**Access:** `customer`

**Request Body:**
```json
{
  "quantity": 5
}
```

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "Cart updated.",
  "data": {
    "cartItemId": "ci_001",
    "quantity": 5,
    "subtotal": 900
  }
}
```

---

### 5.4 Remove Item from Cart

**DELETE** `/cart/:cartItemId`
**Access:** `customer`

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "Item removed from cart."
}
```

---

### 5.5 Clear Cart

**DELETE** `/cart`
**Access:** `customer`

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "Cart cleared."
}
```

---

## 6. Orders

### 6.1 Place Order (Checkout)

**POST** `/orders`
**Access:** `customer`

**Request Body:**
```json
{
  "deliveryAddressId": "addr_001",
  "paymentMethod": "jazzcash",
  "paymentDetails": {
    "mobileNumber": "03001234567",
    "transactionId": "TXN_JAZZ_20240901_123456"
  },
  "cartId": "cart_abc123",
  "notes": "Please leave at gate"
}
```

**Supported `paymentMethod` values:** `jazzcash` | `easypaisa` | `cod` | `pay_at_store`

**Expected Response `201`:**
```json
{
  "success": true,
  "message": "Order placed successfully.",
  "data": {
    "orderId": "ORD-2024-00124",
    "status": "pending",
    "totalAmount": 540,
    "currency": "PKR",
    "paymentMethod": "jazzcash",
    "paymentStatus": "paid",
    "estimatedDelivery": "2024-09-03",
    "items": [
      {
        "productId": "prod_001",
        "productName": "Olper's Milk 1L",
        "quantity": 3,
        "unitPrice": 180,
        "total": 540
      }
    ],
    "deliveryAddress": {
      "street": "House 12, Street 4, Gulberg III",
      "city": "Lahore"
    }
  }
}
```

---

### 6.2 Get Customer Order History

**GET** `/orders?status=delivered&page=1&limit=10`
**Access:** `customer`

**Query Parameters:**

| Param | Description |
|---|---|
| `status` | `pending` \| `processing` \| `delivered` \| `cancelled` \| `all` |
| `page` | Page number |
| `limit` | Items per page |

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "orderId": "ORD-2024-00124",
        "storeName": "Khan General Store",
        "orderDate": "2024-09-01T14:30:00.000Z",
        "totalAmount": 540,
        "currency": "PKR",
        "itemCount": 3,
        "paymentMethod": "jazzcash",
        "status": "delivered"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalOrders": 24
    }
  }
}
```

---

### 6.3 Get Order Detail (Customer)

**GET** `/orders/:orderId`
**Access:** `customer`

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "orderId": "ORD-2024-00124",
    "status": "delivered",
    "orderDate": "2024-09-01T14:30:00.000Z",
    "deliveredAt": "2024-09-03T11:00:00.000Z",
    "store": {
      "storeId": "store_001",
      "storeName": "Khan General Store"
    },
    "items": [
      {
        "productId": "prod_001",
        "productName": "Olper's Milk 1L",
        "image": "https://cdn.localbiz.pk/products/olpers_1.jpg",
        "quantity": 3,
        "unitPrice": 180,
        "total": 540
      }
    ],
    "deliveryAddress": {
      "street": "House 12, Street 4, Gulberg III",
      "city": "Lahore"
    },
    "paymentMethod": "jazzcash",
    "paymentStatus": "paid",
    "totalAmount": 540,
    "currency": "PKR",
    "timeline": [
      { "status": "Order Placed", "timestamp": "2024-09-01T14:30:00.000Z" },
      { "status": "Confirmed", "timestamp": "2024-09-01T15:00:00.000Z" },
      { "status": "Processing", "timestamp": "2024-09-02T09:00:00.000Z" },
      { "status": "Delivered", "timestamp": "2024-09-03T11:00:00.000Z" }
    ]
  }
}
```

---

### 6.4 Cancel Order (Customer)

**PUT** `/orders/:orderId/cancel`
**Access:** `customer`

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "Order cancelled successfully.",
  "data": {
    "orderId": "ORD-2024-00124",
    "status": "cancelled"
  }
}
```

---

## 7. Payments

### 7.1 Initiate JazzCash Payment

**POST** `/payments/jazzcash/initiate`
**Access:** `customer`

**Request Body:**
```json
{
  "orderId": "ORD-2024-00124",
  "amount": 540,
  "mobileNumber": "03001234567"
}
```

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "paymentId": "pay_001",
    "transactionReference": "TXN_JAZZ_20240901_123456",
    "status": "initiated",
    "redirectUrl": "https://sandbox.jazzcash.com.pk/CustomerPortal/transact/...",
    "expiresAt": "2024-09-01T15:00:00.000Z"
  }
}
```

---

### 7.2 Initiate Easypaisa Payment

**POST** `/payments/easypaisa/initiate`
**Access:** `customer`

**Request Body:**
```json
{
  "orderId": "ORD-2024-00124",
  "amount": 540,
  "mobileNumber": "03211234567"
}
```

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "paymentId": "pay_002",
    "transactionReference": "TXN_EP_20240901_654321",
    "status": "initiated",
    "redirectUrl": "https://easypay.easypaisa.com.pk/...",
    "expiresAt": "2024-09-01T15:00:00.000Z"
  }
}
```

---

### 7.3 Verify Payment Status

**GET** `/payments/:paymentId/status`
**Access:** `customer`

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "paymentId": "pay_001",
    "orderId": "ORD-2024-00124",
    "amount": 540,
    "currency": "PKR",
    "method": "jazzcash",
    "status": "paid",
    "transactionReference": "TXN_JAZZ_20240901_123456",
    "paidAt": "2024-09-01T14:45:00.000Z"
  }
}
```

---

## 8. Returns

### 8.1 Create Return Request

**POST** `/returns`
**Access:** `customer`

**Request Body:**
```json
{
  "orderId": "ORD-2024-00124",
  "orderItemId": "oi_001",
  "reason": "Product was damaged on arrival",
  "description": "The milk carton was punctured and leaking.",
  "images": ["base64_or_url_1", "base64_or_url_2"]
}
```

**Expected Response `201`:**
```json
{
  "success": true,
  "message": "Return request submitted.",
  "data": {
    "returnId": "RET-001",
    "orderId": "ORD-2024-00124",
    "status": "pending",
    "submittedAt": "2024-09-05T10:00:00.000Z"
  }
}
```

---

### 8.2 Get Return Requests (Customer)

**GET** `/returns`
**Access:** `customer`

**Expected Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "returnId": "RET-001",
      "orderId": "ORD-2024-00124",
      "productName": "Olper's Milk 1L",
      "reason": "Product was damaged on arrival",
      "status": "pending",
      "submittedAt": "2024-09-05T10:00:00.000Z"
    }
  ]
}
```

---

## 9. AI Recommendations

### 9.1 Get Personalized Product Recommendations

**GET** `/recommendations`
**Access:** `customer`

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `limit` | number | Number of recommendations (default: 10) |

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "algorithm": "collaborative_filtering",
    "recommendations": [
      {
        "productId": "prod_045",
        "name": "Nestle Everyday Tea Whitener 400g",
        "price": 320,
        "currency": "PKR",
        "image": "https://cdn.localbiz.pk/products/nestle_tw.jpg",
        "category": "Beverages",
        "store": {
          "storeId": "store_001",
          "storeName": "Khan General Store"
        },
        "inStock": true,
        "similarityScore": 0.87
      }
    ],
    "basedOn": "purchase_history",
    "generatedAt": "2024-09-01T14:30:00.000Z"
  }
}
```

---

### 9.2 Get Similar Products (Product Page)

**GET** `/recommendations/similar/:productId?limit=6`
**Access:** `customer`

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "sourceProductId": "prod_001",
    "similarProducts": [
      {
        "productId": "prod_007",
        "name": "Engro Olfrut Milk 1L",
        "price": 175,
        "currency": "PKR",
        "image": "https://cdn.localbiz.pk/products/olfrut.jpg",
        "inStock": true
      }
    ]
  }
}
```

---

### 9.3 Log User Interaction (for AI Training)

**POST** `/recommendations/interaction`
**Access:** `customer`

**Request Body:**
```json
{
  "productId": "prod_001",
  "interactionType": "view",
  "durationSeconds": 45
}
```

**Supported `interactionType` values:** `view` | `add_to_cart` | `purchase` | `search`

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "Interaction logged."
}
```

---

## 10. Business Administrator Module

### 10.1 Get Business Profile

**GET** `/business/profile`
**Access:** `business_admin`

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "businessId": "store_001",
    "storeName": "Khan General Store",
    "category": "Grocery",
    "description": "Fresh groceries and household items.",
    "logo": "https://cdn.localbiz.pk/logos/khan.png",
    "coverImage": "https://cdn.localbiz.pk/stores/khan.jpg",
    "address": "Street 4, Block B, Gulberg III, Lahore",
    "city": "Lahore",
    "phone": "03211234567",
    "operatingHours": {
      "Monday": "08:00-22:00",
      "Tuesday": "08:00-22:00",
      "Wednesday": "08:00-22:00",
      "Thursday": "08:00-22:00",
      "Friday": "08:00-21:00",
      "Saturday": "09:00-21:00",
      "Sunday": "Closed"
    },
    "approvalStatus": "approved",
    "rating": 4.5,
    "isActive": true
  }
}
```

---

### 10.2 Update Business Profile

**PUT** `/business/profile`
**Access:** `business_admin`

**Request Body:**
```json
{
  "storeName": "Khan Super Store",
  "description": "Updated description.",
  "phone": "03211112222",
  "logo": "base64_or_url",
  "coverImage": "base64_or_url",
  "operatingHours": {
    "Monday": "09:00-22:00",
    "Sunday": "10:00-18:00"
  }
}
```

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "Business profile updated."
}
```

---

### 10.3 Get All Products (Business Admin View)

**GET** `/business/products?category=Dairy&status=active&page=1&limit=20`
**Access:** `business_admin`

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "productId": "prod_001",
        "name": "Olper's Milk 1L",
        "category": "Dairy",
        "price": 180,
        "stockQty": 45,
        "status": "active",
        "image": "https://cdn.localbiz.pk/products/olpers_1.jpg",
        "createdAt": "2024-08-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 8,
      "totalProducts": 142
    }
  }
}
```

---

### 10.4 Add Product

**POST** `/business/products`
**Access:** `business_admin`

**Request Body:**
```json
{
  "name": "Tapal Danedar 200g",
  "description": "Premium black tea blend",
  "price": 250,
  "category": "Beverages",
  "stockQty": 80,
  "images": ["base64_or_url_1"],
  "status": "active"
}
```

**Expected Response `201`:**
```json
{
  "success": true,
  "message": "Product added successfully.",
  "data": {
    "productId": "prod_143",
    "name": "Tapal Danedar 200g",
    "category": "Beverages",
    "price": 250,
    "stockQty": 80,
    "status": "active"
  }
}
```

---

### 10.5 Update Product

**PUT** `/business/products/:productId`
**Access:** `business_admin`

**Request Body:**
```json
{
  "price": 270,
  "stockQty": 100,
  "status": "active",
  "description": "Updated premium black tea blend"
}
```

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "Product updated successfully."
}
```

---

### 10.6 Delete Product

**DELETE** `/business/products/:productId`
**Access:** `business_admin`

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "Product deleted successfully."
}
```

---

### 10.7 Get All Orders (Business Admin)

**GET** `/business/orders?status=pending&page=1&limit=10`
**Access:** `business_admin`

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "orderId": "ORD-2024-00124",
        "customerName": "Ahmed Raza",
        "customerPhone": "03001234567",
        "orderDate": "2024-09-01T14:30:00.000Z",
        "itemCount": 3,
        "totalAmount": 540,
        "paymentMethod": "jazzcash",
        "paymentStatus": "paid",
        "status": "pending"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 4,
      "totalOrders": 38
    }
  }
}
```

---

### 10.8 Get Order Detail (Business Admin)

**GET** `/business/orders/:orderId`
**Access:** `business_admin`

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "orderId": "ORD-2024-00124",
    "customer": {
      "name": "Ahmed Raza",
      "email": "ahmed@example.com",
      "phone": "03001234567"
    },
    "deliveryAddress": {
      "street": "House 12, Street 4, Gulberg III",
      "city": "Lahore"
    },
    "items": [
      {
        "orderItemId": "oi_001",
        "productId": "prod_001",
        "productName": "Olper's Milk 1L",
        "quantity": 3,
        "unitPrice": 180,
        "total": 540
      }
    ],
    "paymentMethod": "jazzcash",
    "paymentStatus": "paid",
    "totalAmount": 540,
    "status": "pending",
    "notes": "Please leave at gate",
    "orderDate": "2024-09-01T14:30:00.000Z"
  }
}
```

---

### 10.9 Update Order Status

**PUT** `/business/orders/:orderId/status`
**Access:** `business_admin`

**Request Body:**
```json
{
  "status": "processing",
  "note": "Order is being prepared"
}
```

**Supported `status` values:** `pending` | `confirmed` | `processing` | `ready` | `delivered` | `cancelled`

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "Order status updated.",
  "data": {
    "orderId": "ORD-2024-00124",
    "status": "processing"
  }
}
```

---

### 10.10 Handle Return Request (Business Admin)

**PUT** `/business/returns/:returnId`
**Access:** `business_admin`

**Request Body:**
```json
{
  "status": "approved",
  "note": "Refund will be processed within 3 business days."
}
```

**Supported `status` values:** `approved` | `rejected`

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "Return request updated.",
  "data": {
    "returnId": "RET-001",
    "status": "approved"
  }
}
```

---

## 11. Inventory Management

### 11.1 Get Inventory Overview

**GET** `/business/inventory`
**Access:** `business_admin`

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "totalProducts": 142,
    "inStock": 128,
    "lowStock": 10,
    "outOfStock": 4,
    "lowStockThreshold": 5,
    "products": [
      {
        "productId": "prod_001",
        "name": "Olper's Milk 1L",
        "category": "Dairy",
        "stockQty": 45,
        "stockStatus": "in_stock"
      },
      {
        "productId": "prod_022",
        "name": "Tapal Green Tea 30s",
        "category": "Beverages",
        "stockQty": 3,
        "stockStatus": "low_stock"
      },
      {
        "productId": "prod_078",
        "name": "Lifebuoy Soap 3-Pack",
        "category": "Household",
        "stockQty": 0,
        "stockStatus": "out_of_stock"
      }
    ]
  }
}
```

**`stockStatus` values:** `in_stock` (>20) | `low_stock` (1–20) | `out_of_stock` (0)

---

### 11.2 Get Low Stock Alerts

**GET** `/business/inventory/alerts`
**Access:** `business_admin`

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "productId": "prod_022",
        "name": "Tapal Green Tea 30s",
        "category": "Beverages",
        "currentStock": 3,
        "lowStockThreshold": 5,
        "alertLevel": "critical"
      }
    ],
    "totalAlerts": 10
  }
}
```

---

### 11.3 Update Stock Quantity

**PUT** `/business/inventory/:productId/stock`
**Access:** `business_admin`

**Request Body:**
```json
{
  "stockQty": 50,
  "operation": "set"
}
```

**Supported `operation` values:** `set` | `increment` | `decrement`

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "Stock updated.",
  "data": {
    "productId": "prod_022",
    "previousStock": 3,
    "updatedStock": 50
  }
}
```

---

### 11.4 Export Inventory CSV

**GET** `/business/inventory/export`
**Access:** `business_admin`

**Expected Response `200`:**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="inventory_export_2024-09-01.csv"

ProductID,Name,Category,Price,StockQty,Status
prod_001,Olper's Milk 1L,Dairy,180,45,active
...
```

---

## 12. Analytics & Reports (Business)

### 12.1 Get Business Dashboard Summary

**GET** `/business/analytics/summary`
**Access:** `business_admin`

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 285000,
    "revenueToday": 4850,
    "ordersToday": 9,
    "pendingOrders": 4,
    "lowStockAlerts": 10,
    "currency": "PKR",
    "revenueGrowth": "+12.4%",
    "ordersGrowth": "+5.2%"
  }
}
```

---

### 12.2 Get Sales Trend

**GET** `/business/analytics/sales?period=monthly&year=2024`
**Access:** `business_admin`

**Query Parameters:**

| Param | Values |
|---|---|
| `period` | `daily` \| `weekly` \| `monthly` |
| `year` | e.g. `2024` |
| `month` | e.g. `9` (for daily period) |

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "period": "monthly",
    "year": 2024,
    "salesData": [
      { "label": "Jan", "revenue": 18500, "orders": 84 },
      { "label": "Feb", "revenue": 21200, "orders": 96 },
      { "label": "Mar", "revenue": 19800, "orders": 90 },
      { "label": "Apr", "revenue": 24100, "orders": 108 }
    ],
    "currency": "PKR"
  }
}
```

---

### 12.3 Get Top Selling Products

**GET** `/business/analytics/top-products?limit=5&period=monthly`
**Access:** `business_admin`

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "topProducts": [
      {
        "rank": 1,
        "productId": "prod_001",
        "name": "Olper's Milk 1L",
        "image": "https://cdn.localbiz.pk/products/olpers_1.jpg",
        "unitsSold": 312,
        "revenue": 56160
      }
    ]
  }
}
```

---

### 12.4 Get Payment Method Breakdown

**GET** `/business/analytics/payments?period=monthly&year=2024`
**Access:** `business_admin`

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "breakdown": [
      { "method": "jazzcash", "count": 145, "amount": 112000, "percentage": 42.1 },
      { "method": "easypaisa", "count": 98, "amount": 76000, "percentage": 28.4 },
      { "method": "cod", "count": 72, "amount": 59000, "percentage": 21.6 },
      { "method": "pay_at_store", "count": 27, "amount": 21000, "percentage": 7.9 }
    ]
  }
}
```

---

### 12.5 Get Customer Insights

**GET** `/business/analytics/customers`
**Access:** `business_admin`

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "totalUniqueCustomers": 184,
    "returningCustomers": 112,
    "newCustomers": 72,
    "returningRate": "60.9%"
  }
}
```

---

## 13. Super Administrator Module

### 13.1 Super Admin Login

**POST** `/auth/admin/login`
**Access:** Public (Super Admin only)

**Request Body:**
```json
{
  "email": "admin@localbiz.pk",
  "password": "SuperAdminSecure!"
}
```

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "Admin login successful.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "role": "super_admin",
    "admin": {
      "id": "admin_001",
      "fullName": "Platform Admin",
      "email": "admin@localbiz.pk"
    }
  }
}
```

---

### 13.2 Get Platform Dashboard Summary

**GET** `/admin/dashboard`
**Access:** `super_admin`

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "totalRegisteredUsers": 1284,
    "totalActiveStores": 72,
    "pendingApprovals": 6,
    "totalPlatformOrders": 8920,
    "platformRevenue": 4250000,
    "currency": "PKR",
    "newUsersThisMonth": 84,
    "newStoresThisMonth": 5
  }
}
```

---

### 13.3 Get All Business Registration Requests

**GET** `/admin/businesses?status=pending&page=1&limit=10`
**Access:** `super_admin`

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "businesses": [
      {
        "businessId": "store_biz_012",
        "storeName": "Ali Kiryana Store",
        "ownerName": "Ali Hassan",
        "ownerEmail": "ali@store.com",
        "category": "Grocery",
        "city": "Lahore",
        "submittedAt": "2024-09-01T10:00:00.000Z",
        "approvalStatus": "pending"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "total": 6
    }
  }
}
```

---

### 13.4 Review Business Registration

**GET** `/admin/businesses/:businessId`
**Access:** `super_admin`

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "businessId": "store_biz_012",
    "storeName": "Ali Kiryana Store",
    "logo": "https://cdn.localbiz.pk/logos/ali.png",
    "owner": {
      "name": "Ali Hassan",
      "email": "ali@store.com",
      "phone": "03331234567"
    },
    "category": "Grocery",
    "address": "Plot 7, Johar Town, Lahore",
    "city": "Lahore",
    "description": "Local grocery shop serving Johar Town since 2010.",
    "approvalStatus": "pending",
    "submittedAt": "2024-09-01T10:00:00.000Z"
  }
}
```

---

### 13.5 Approve or Reject Business

**PUT** `/admin/businesses/:businessId/decision`
**Access:** `super_admin`

**Request Body (Approve):**
```json
{
  "decision": "approved"
}
```

**Request Body (Reject):**
```json
{
  "decision": "rejected",
  "reason": "Incomplete store information provided."
}
```

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "Business registration approved.",
  "data": {
    "businessId": "store_biz_012",
    "approvalStatus": "approved"
  }
}
```

---

### 13.6 Get All Users

**GET** `/admin/users?role=customer&status=active&page=1&limit=20`
**Access:** `super_admin`

**Query Parameters:**

| Param | Values |
|---|---|
| `role` | `customer` \| `business_admin` \| `all` |
| `status` | `active` \| `suspended` \| `all` |

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
        "fullName": "Ahmed Raza",
        "email": "ahmed@example.com",
        "role": "customer",
        "joinedAt": "2024-08-01T00:00:00.000Z",
        "status": "active",
        "totalOrders": 24
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 65,
      "totalUsers": 1284
    }
  }
}
```

---

### 13.7 Suspend User

**PUT** `/admin/users/:userId/suspend`
**Access:** `super_admin`

**Request Body:**
```json
{
  "reason": "Reported for fraudulent activity."
}
```

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "User suspended successfully.",
  "data": {
    "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "status": "suspended"
  }
}
```

---

### 13.8 Reactivate User

**PUT** `/admin/users/:userId/activate`
**Access:** `super_admin`

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "User account reactivated.",
  "data": {
    "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "status": "active"
  }
}
```

---

### 13.9 Remove User

**DELETE** `/admin/users/:userId`
**Access:** `super_admin`

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "User removed from platform."
}
```

---

## 14. Category Management

### 14.1 Get All Categories

**GET** `/categories`
**Access:** Public

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "categoryId": "cat_001",
        "name": "Grocery",
        "icon": "https://cdn.localbiz.pk/icons/grocery.svg",
        "totalStores": 28,
        "isActive": true
      },
      {
        "categoryId": "cat_002",
        "name": "Pharmacy",
        "icon": "https://cdn.localbiz.pk/icons/pharmacy.svg",
        "totalStores": 12,
        "isActive": true
      }
    ]
  }
}
```

---

### 14.2 Create Category

**POST** `/admin/categories`
**Access:** `super_admin`

**Request Body:**
```json
{
  "name": "Electronics",
  "icon": "base64_or_url",
  "isActive": true
}
```

**Expected Response `201`:**
```json
{
  "success": true,
  "message": "Category created.",
  "data": {
    "categoryId": "cat_010",
    "name": "Electronics",
    "isActive": true
  }
}
```

---

### 14.3 Update Category

**PUT** `/admin/categories/:categoryId`
**Access:** `super_admin`

**Request Body:**
```json
{
  "name": "Electronics & Gadgets",
  "isActive": false
}
```

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "Category updated."
}
```

---

### 14.4 Delete Category

**DELETE** `/admin/categories/:categoryId`
**Access:** `super_admin`

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "Category deleted."
}
```

---

### 14.5 Get All Service Areas

**GET** `/admin/service-areas`
**Access:** `super_admin`

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "areas": [
      { "areaId": "area_001", "city": "Lahore", "isActive": true, "totalStores": 48 },
      { "areaId": "area_002", "city": "Karachi", "isActive": true, "totalStores": 31 },
      { "areaId": "area_003", "city": "Islamabad", "isActive": false, "totalStores": 0 }
    ]
  }
}
```

---

### 14.6 Add/Update Service Area

**POST** `/admin/service-areas`
**Access:** `super_admin`

**Request Body:**
```json
{
  "city": "Faisalabad",
  "isActive": true
}
```

**Expected Response `201`:**
```json
{
  "success": true,
  "message": "Service area added.",
  "data": {
    "areaId": "area_004",
    "city": "Faisalabad",
    "isActive": true
  }
}
```

---

## 15. Platform Reports (Super Admin)

### 15.1 Get Platform Growth Stats

**GET** `/admin/reports/growth?period=monthly&year=2024`
**Access:** `super_admin`

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "period": "monthly",
    "year": 2024,
    "growth": [
      {
        "label": "Jan",
        "newUsers": 64,
        "newStores": 3,
        "totalOrders": 620,
        "platformRevenue": 310000
      },
      {
        "label": "Feb",
        "newUsers": 78,
        "newStores": 4,
        "totalOrders": 710,
        "platformRevenue": 365000
      }
    ],
    "currency": "PKR"
  }
}
```

---

### 15.2 Get Top Active Stores

**GET** `/admin/reports/top-stores?limit=10`
**Access:** `super_admin`

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "topStores": [
      {
        "rank": 1,
        "storeId": "store_001",
        "storeName": "Khan General Store",
        "city": "Lahore",
        "totalOrders": 486,
        "revenue": 312000
      }
    ]
  }
}
```

---

### 15.3 Export Platform Report

**GET** `/admin/reports/export?period=monthly&year=2024`
**Access:** `super_admin`

**Expected Response `200`:**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="platform_report_2024.csv"
```

---

## 16. Notifications

### 16.1 Get Notifications

**GET** `/notifications?page=1&limit=20`
**Access:** All authenticated roles

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "unreadCount": 3,
    "notifications": [
      {
        "notificationId": "notif_001",
        "type": "order_update",
        "title": "Order Delivered",
        "message": "Your order ORD-2024-00124 has been delivered.",
        "isRead": false,
        "createdAt": "2024-09-03T11:00:00.000Z",
        "metadata": {
          "orderId": "ORD-2024-00124"
        }
      },
      {
        "notificationId": "notif_002",
        "type": "low_stock",
        "title": "Low Stock Alert",
        "message": "Tapal Green Tea 30s has only 3 units left.",
        "isRead": true,
        "createdAt": "2024-09-02T08:00:00.000Z",
        "metadata": {
          "productId": "prod_022"
        }
      }
    ]
  }
}
```

---

### 16.2 Mark Notification as Read

**PUT** `/notifications/:notificationId/read`
**Access:** All authenticated roles

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "Notification marked as read."
}
```

---

### 16.3 Mark All Notifications as Read

**PUT** `/notifications/read-all`
**Access:** All authenticated roles

**Expected Response `200`:**
```json
{
  "success": true,
  "message": "All notifications marked as read."
}
```

---

## 17. Invoices

### 17.1 Get Invoice for Order

**GET** `/invoices/:orderId`
**Access:** `customer` | `business_admin`

**Expected Response `200`:**
```json
{
  "success": true,
  "data": {
    "invoiceNumber": "INV-2024-00124",
    "orderId": "ORD-2024-00124",
    "issuedAt": "2024-09-03T11:00:00.000Z",
    "store": {
      "name": "Khan General Store",
      "address": "Street 4, Block B, Gulberg III, Lahore",
      "phone": "03211234567"
    },
    "customer": {
      "name": "Ahmed Raza",
      "email": "ahmed@example.com",
      "address": "House 12, Street 4, Gulberg III, Lahore"
    },
    "items": [
      {
        "productName": "Olper's Milk 1L",
        "quantity": 3,
        "unitPrice": 180,
        "total": 540
      }
    ],
    "subtotal": 540,
    "tax": 0,
    "grandTotal": 540,
    "currency": "PKR",
    "paymentMethod": "JazzCash",
    "paymentStatus": "Paid"
  }
}
```

---

### 17.2 Download Invoice PDF

**GET** `/invoices/:orderId/download`
**Access:** `customer` | `business_admin`

**Expected Response `200`:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="invoice_ORD-2024-00124.pdf"

[Binary PDF stream]
```

---

## Route Summary Table

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/auth/register/customer` | Public | Register customer |
| POST | `/auth/register/business` | Public | Register business |
| POST | `/auth/login` | Public | Login all roles |
| POST | `/auth/verify-email` | Public | Verify email OTP |
| POST | `/auth/forgot-password` | Public | Request reset OTP |
| POST | `/auth/reset-password` | Public | Reset password |
| POST | `/auth/logout` | Auth | Logout |
| POST | `/auth/admin/login` | Public | Super admin login |
| GET | `/customer/profile` | Customer | Get profile |
| PUT | `/customer/profile` | Customer | Update profile |
| POST | `/customer/addresses` | Customer | Add address |
| PUT | `/customer/addresses/:id` | Customer | Update address |
| DELETE | `/customer/addresses/:id` | Customer | Delete address |
| PUT | `/customer/change-password` | Customer | Change password |
| GET | `/customer/insights` | Customer | Spending insights |
| GET | `/stores` | Customer | Browse stores |
| GET | `/stores/:storeId` | Customer | Store details |
| GET | `/stores/:storeId/products` | Customer | Store products |
| GET | `/products/:productId` | Customer | Product details |
| GET | `/cart` | Customer | View cart |
| POST | `/cart` | Customer | Add to cart |
| PUT | `/cart/:cartItemId` | Customer | Update cart item |
| DELETE | `/cart/:cartItemId` | Customer | Remove cart item |
| DELETE | `/cart` | Customer | Clear cart |
| POST | `/orders` | Customer | Place order |
| GET | `/orders` | Customer | Order history |
| GET | `/orders/:orderId` | Customer | Order detail |
| PUT | `/orders/:orderId/cancel` | Customer | Cancel order |
| POST | `/payments/jazzcash/initiate` | Customer | JazzCash payment |
| POST | `/payments/easypaisa/initiate` | Customer | Easypaisa payment |
| GET | `/payments/:paymentId/status` | Customer | Payment status |
| POST | `/returns` | Customer | Create return |
| GET | `/returns` | Customer | View returns |
| GET | `/recommendations` | Customer | AI recommendations |
| GET | `/recommendations/similar/:productId` | Customer | Similar products |
| POST | `/recommendations/interaction` | Customer | Log interaction |
| GET | `/business/profile` | Business | Business profile |
| PUT | `/business/profile` | Business | Update profile |
| GET | `/business/products` | Business | All products |
| POST | `/business/products` | Business | Add product |
| PUT | `/business/products/:id` | Business | Update product |
| DELETE | `/business/products/:id` | Business | Delete product |
| GET | `/business/orders` | Business | All orders |
| GET | `/business/orders/:orderId` | Business | Order detail |
| PUT | `/business/orders/:orderId/status` | Business | Update order status |
| PUT | `/business/returns/:returnId` | Business | Handle return |
| GET | `/business/inventory` | Business | Inventory overview |
| GET | `/business/inventory/alerts` | Business | Low stock alerts |
| PUT | `/business/inventory/:id/stock` | Business | Update stock |
| GET | `/business/inventory/export` | Business | Export CSV |
| GET | `/business/analytics/summary` | Business | Dashboard summary |
| GET | `/business/analytics/sales` | Business | Sales trend |
| GET | `/business/analytics/top-products` | Business | Top products |
| GET | `/business/analytics/payments` | Business | Payment breakdown |
| GET | `/business/analytics/customers` | Business | Customer insights |
| GET | `/admin/dashboard` | Super Admin | Platform summary |
| GET | `/admin/businesses` | Super Admin | Business requests |
| GET | `/admin/businesses/:id` | Super Admin | Business review |
| PUT | `/admin/businesses/:id/decision` | Super Admin | Approve/reject |
| GET | `/admin/users` | Super Admin | All users |
| PUT | `/admin/users/:id/suspend` | Super Admin | Suspend user |
| PUT | `/admin/users/:id/activate` | Super Admin | Activate user |
| DELETE | `/admin/users/:id` | Super Admin | Remove user |
| GET | `/categories` | Public | All categories |
| POST | `/admin/categories` | Super Admin | Create category |
| PUT | `/admin/categories/:id` | Super Admin | Update category |
| DELETE | `/admin/categories/:id` | Super Admin | Delete category |
| GET | `/admin/service-areas` | Super Admin | Service areas |
| POST | `/admin/service-areas` | Super Admin | Add service area |
| GET | `/admin/reports/growth` | Super Admin | Growth stats |
| GET | `/admin/reports/top-stores` | Super Admin | Top stores |
| GET | `/admin/reports/export` | Super Admin | Export report |
| GET | `/notifications` | Auth | Get notifications |
| PUT | `/notifications/:id/read` | Auth | Mark read |
| PUT | `/notifications/read-all` | Auth | Mark all read |
| GET | `/invoices/:orderId` | Auth | Get invoice |
| GET | `/invoices/:orderId/download` | Auth | Download PDF |

---

*Generated for LocalBiz — AI-Powered Web Platform for Business and Customer Management*
*NUML Final Year Project 2026 | MERN Stack | JWT | MongoDB Atlas*
