import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const ProductList = () => {
  const [productList, setProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    fetch("https://mocki.io/v1/eca56f9c-255f-4f7a-9c31-cece6450a5fc")
      .then((response) => response.json())
      .then((data) => {
        setProductList(data);
        const prices = data.map((product) => product.price);
        setMinPrice(Math.min(...prices));
        setMaxPrice(Math.max(...prices));
      });
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
            padding: "1.25rem",
          }}
        >
          {filteredList.map((product) => (
            <Card
              key={product.id}
              style={{ width: "100%", maxWidth: "250px", margin: "auto" }}
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
                <Card.Text>
                  <span>Price: ${product.price.toFixed(2)}</span>
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
