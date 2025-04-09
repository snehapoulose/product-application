import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { getApiBaseUrl } from "../config";
import { checkApiResponse } from "../utils/apiUtils";

const ProductList = () => {
  const [productList, setProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [filteredList, setFilteredList] = useState([]);

  // Edit modal state
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const API_BASE_URL = getApiBaseUrl();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products`);
        // if (!response.ok)
        //   throw new Error(`HTTP error! Status: ${response.status}`);
        await checkApiResponse(response);
        const data = await response.json();
        setProductList(data);
        const prices = data.map((product) => product.price);
        setMinPrice(Math.min(...prices));
        setMaxPrice(Math.max(...prices));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = productList;
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    filtered = filtered.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );
    setFilteredList(filtered);
  }, [productList, searchTerm, minPrice, maxPrice]);

  const clearFilters = () => {
    setSearchTerm("");
    setMinPrice(0);
    setMaxPrice(1000);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditPrice(product.price);
    setShowModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      // Validate inputs
      if (!editName.trim()) {
        throw new Error("Product name cannot be empty");
      }
      if (isNaN(editPrice) || parseFloat(editPrice) <= 0) {
        throw new Error("Product price must be a positive number");
      }

      // Prepare updated product object
      const updatedProduct = {
        ...editingProduct,
        name: editName.trim(),
        price: parseFloat(editPrice),
      };

      // Send PUT request to update the product
      const response = await fetch(
        `${API_BASE_URL}/products/${editingProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      // // Check for response errors
      // if (!response.ok) {
      //   throw new Error(
      //     `Failed to update product: ${response.status} ${response.statusText}`
      //   );
      // }
      await checkApiResponse(response);

      // Parse response JSON
      const data = await response.json();

      // Update product list state
      setProductList((prev) => prev.map((p) => (p.id === data.id ? data : p)));

      // Close the modal
      setShowModal(false);
    } catch (error) {
      console.error("Error updating product:", error);
      // Optionally display error to the user using a toast or modal
    }
  };
  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirm) return;

    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
      });

      // if (!response.ok) throw new Error("Failed to delete product");
      await checkApiResponse(response);

      // Update state after deletion
      setProductList((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h1>Products List</h1>
      </header>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <Form.Control
          type="text"
          placeholder="Search a product"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: "1", minWidth: "200px" }}
        />
        <span>
          Price: ${minPrice} - ${maxPrice}
        </span>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="range"
            min="0"
            max="1000"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
          />
          <input
            type="range"
            min="0"
            max="1000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
        <Button variant="secondary" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

      {filteredList.length === 0 ? (
        <p>Loading products...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {filteredList.map((product) => (
            <Card
              key={product.id}
              style={{ maxWidth: "250px", margin: "auto" }}
            >
              <Card.Img
                src={product.image}
                alt={product.name}
                width="200"
                height="150"
                style={{ objectFit: "cover", borderRadius: "0.5rem" }}
              />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Subtitle>Category: {product.category}</Card.Subtitle>
                <Card.Text>Price: ${product.price.toFixed(2)}</Card.Text>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleEditClick(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="editPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleEditSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductList;
