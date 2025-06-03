"use client";

import { useState, useEffect } from "react";

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    const response = await fetch("/api/productos");
    const data = await response.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (product) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error("Error al agregar el producto");
      }

      fetchProducts();
      setShowAddModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este producto?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/productos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el producto");
      }

      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditProduct = async (product) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/productos/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error("Error al editar el producto");
      }

      fetchProducts();
      setShowEditModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      <button
        onClick={() => setShowAddModal(true)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Agregar Producto
      </button>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Descripción</th>
            <th className="p-2 border">Precio</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="p-2 border">{product.name}</td>
              <td className="p-2 border">{product.description}</td>
              <td className="p-2 border">${product.price}</td>
              <td className="p-2 border">
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowEditModal(true);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddProduct}
        />
      )}

      {showEditModal && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setShowEditModal(false)}
          onEdit={handleEditProduct}
        />
      )}
    </div>
  );
}

function AddProductModal({ onClose, onAdd }) {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image_url: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(product);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Agregar Producto</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <input
            type="text"
            placeholder="Descripción"
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            className="w-full p-2 border rounded mb-2"
            required
          />
          <input
            type="number"
            placeholder="Precio"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={product.stock}
            onChange={(e) => setProduct({ ...product, stock: e.target.value })}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <input
            type="text"
            placeholder="URL de Imagen"
            value={product.image_url}
            onChange={(e) =>
              setProduct({ ...product, image_url: e.target.value })
            }
            className="w-full p-2 border rounded mb-2"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded"
          >
            Agregar
          </button>
        </form>
        <button
          onClick={onClose}
          className="w-full bg-gray-500 text-white p-2 rounded mt-2"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

function EditProductModal({ product, onClose, onEdit }) {
  const [updatedProduct, setUpdatedProduct] = useState(product);

  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit(updatedProduct);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre"
            value={updatedProduct.name}
            onChange={(e) =>
              setUpdatedProduct({ ...updatedProduct, name: e.target.value })
            }
            className="w-full p-2 border rounded mb-2"
            required
          />
          <input
            type="text"
            placeholder="Descripción"
            value={updatedProduct.description}
            onChange={(e) =>
              setUpdatedProduct({
                ...updatedProduct,
                description: e.target.value,
              })
            }
            className="w-full p-2 border rounded mb-2"
            required
          />
          <input
            type="number"
            placeholder="Precio"
            value={updatedProduct.price}
            onChange={(e) =>
              setUpdatedProduct({ ...updatedProduct, price: e.target.value })
            }
            className="w-full p-2 border rounded mb-2"
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={updatedProduct.stock}
            onChange={(e) =>
              setUpdatedProduct({ ...updatedProduct, stock: e.target.value })
            }
            className="w-full p-2 border rounded mb-2"
            required
          />
          <input
            type="text"
            placeholder="URL de Imagen"
            value={updatedProduct.image_url}
            onChange={(e) =>
              setUpdatedProduct({ ...updatedProduct, image_url: e.target.value })
            }
            className="w-full p-2 border rounded mb-2"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Guardar Cambios
          </button>
        </form>
        <button
          onClick={onClose}
          className="w-full bg-gray-500 text-white p-2 rounded mt-2"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}