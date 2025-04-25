const http = require("http");
const {
  sendJsonResponse,
  sendBadRequest,
  sendNotFound,
  sendSuccess,
} = require("./responseHelpers.cjs");

// Sample product list
let products = [
  {
    id: "1",
    name: "Modern Ergonomic Chair",
    price: 149.99,
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80",
    category: "Furniture",
    isNew: true,
  },
  {
    id: "2",
    name: "Minimalist Desk Lamp",
    price: 59.99,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80",
    category: "Lighting",
    isNew: false,
  },
  {
    id: "3",
    name: "Wooden Coffee Table",
    price: 199.99,
    image:
      "https://ik.imagekit.io/2xkwa8s1i/img/npl_modified_images/TableWardobe/WSCFTANTCIW/WSCFTANTCIW_LS_1.jpg?tr=w-1200",
    category: "Furniture",
    isNew: false,
  },
  {
    id: "4",
    name: "Decorative Wall Clock",
    price: 45.99,
    image:
      "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&q=80",
    category: "Decor",
    isNew: true,
  },
  {
    id: "5",
    name: "Ceramic Plant Pot",
    price: 29.99,
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80",
    category: "Decor",
    isNew: false,
  },
  {
    id: "6",
    name: "Leather Sofa",
    price: 899.99,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
    category: "Furniture",
    isNew: true,
  },
  {
    id: "7",
    name: "Smart LED TV",
    price: 549.99,
    image:
      "https://store.in.panasonic.com/media/catalog/product/cache/40b589206cef99ab7dca1586fe425968/t/h/th-32ms550dx_info_1_new.webp",
    category: "Electronics",
    isNew: true,
  },
  {
    id: "8",
    name: "Wireless Headphones",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    category: "Electronics",
    isNew: false,
  },
];

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === "GET") {
    // Handle GET request to fetch products

    sendSuccess(res, products);
  } else if (req.url.startsWith("/api/products/") && req.method === "PUT") {
    const urlParts = req.url.split("/");
    const productId = urlParts[urlParts.length - 1];

    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const productData = JSON.parse(body);

        // Validate product data (example: ensure name and price are valid)
        if (!productData.name || typeof productData.name !== "string") {
          return sendBadRequest(res, "Invalid product name");
        }
        if (productData.price && typeof productData.price !== "number") {
          return sendBadRequest(res, "Invalid product price");
        }

        const index = products.findIndex((p) => p.id === productId);

        if (index === -1) {
          return sendNotFound(res, "Product not found");
        }

        products[index] = { ...products[index], ...productData };
        sendSuccess(res, products[index]);
      } catch (err) {
        return sendBadRequest(res, "Invalid JSON");
      }
    });
  } else if (req.url.startsWith("/api/products/") && req.method === "DELETE") {
    const id = req.url.split("/")[3];

    // Validate the product ID
    if (!id || typeof id !== "string") {
      return sendBadRequest(res, "Invalid product ID");
    }

    // Find the product in the array
    const index = products.findIndex((p) => p.id === id);

    // Handle product not found
    if (index === -1) {
      return sendNotFound(res, "Product not found");
    }

    // Remove the product from the array
    const deleted = products[index];
    products = products.filter((p) => p.id !== id); // Immutable update

    // // Respond with the deleted product
    sendSuccess(res, {
      message: "Product deleted successfully",
      product: deleted,
    });
  } else {
    
    // Handle 404 Not Found for any other requests
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

// Set the port
const PORT = process.env.PORT || 5000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
