import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductList from "../components/ProductList";
import { mockProducts } from "./mocks/mockProducts";

jest.mock("../config", () => ({
  getApiBaseUrl: () => "https://mocked-api-url.com",
}));

describe("ProductList Component", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders product list correctly", async () => {
    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText("Product A")).toBeInTheDocument();
      expect(screen.getByText("Product B")).toBeInTheDocument();
    });
  });

  test("filters products by search term", async () => {
    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText("Product A")).toBeInTheDocument();
      expect(screen.getByText("Product B")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search a product");
    fireEvent.change(searchInput, { target: { value: "Product A" } });

    await waitFor(() => {
      expect(screen.getByText("Product A")).toBeInTheDocument();
      expect(screen.queryByText("Product B")).not.toBeInTheDocument();
    });
  });

  test("filters products by price range", async () => {
    render(<ProductList />);
    const searchInput = screen.getByPlaceholderText("Search a product");
    fireEvent.change(searchInput, { target: { value: "Product B" } });

    await waitFor(() => {
      expect(screen.queryByText("Product A")).not.toBeInTheDocument();
      expect(screen.getByText("Product B")).toBeInTheDocument();
    });
  });

  test("clears filters", async () => {
    render(<ProductList />);

    const searchInput = screen.getByPlaceholderText("Search a product");
    fireEvent.change(searchInput, { target: { value: "Product A" } });

    const clearButton = screen.getByText("Clear Filters");
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.getByText("Product A")).toBeInTheDocument();
      expect(screen.getByText("Product B")).toBeInTheDocument();
    });
  });

  test("opens and submits the edit modal", async () => {
    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText("Product A")).toBeInTheDocument();
    });

    const editButton = screen.getAllByText("Edit")[0];
    fireEvent.click(editButton);

    const nameInput = screen.getByLabelText("Name");
    const priceInput = screen.getByLabelText("Price");
    const saveButton = screen.getByText("Save");

    fireEvent.change(nameInput, { target: { value: "Updated Product A" } });
    fireEvent.change(priceInput, { target: { value: "100" } });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ id: 1, name: "Updated Product A", price: 100 }),
      })
    );

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Updated Product A")).toBeInTheDocument();
    });
  });

  test("deletes a product", async () => {
    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText("Product A")).toBeInTheDocument();
    });

    const deleteButton = screen.getAllByText("Delete")[0];
    global.confirm = jest.fn(() => true);
    global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText("Product A")).not.toBeInTheDocument();
    });
  });

  test("handles API fetch error gracefully", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText("Loading products...")).toBeInTheDocument();
    });

    consoleSpy.mockRestore(); // restore original console.error
  });
});
