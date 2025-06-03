"use client";

import { useEffect, useState } from "react";

export default function Compras() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch("/api/carrito", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error fetching cart");
        }

        const data = await response.json();
        setCart(data);
        calculateTotal(data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const calculateTotal = (cart) => {
    const totalAmount = cart.reduce((acc, product) => acc + product.price * product.cantidad, 0);
    setTotal(totalAmount);
  };

  const handleIncreaseQuantity = async (id) => {
    const token = localStorage.getItem("token");
    const item = cart.find((item) => item.id === id);
    if (item) {
      try {
        const response = await fetch(`/api/carrito/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cantidad: item.cantidad + 1 }),
        });

        if (!response.ok) {
          throw new Error("Error updating cart item");
        }

        await response.json(); // No es necesario usar la respuesta aquí
        fetchCart(); // Recargar el carrito desde el servidor
      } catch (error) {
        console.error("Error updating cart item:", error);
      }
    }
  };

  const handleDecreaseQuantity = async (id) => {
    const token = localStorage.getItem("token");
    const item = cart.find((item) => item.id === id);
    if (item && item.cantidad > 1) {
      try {
        const response = await fetch(`/api/carrito/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cantidad: item.cantidad - 1 }),
        });

        if (!response.ok) {
          throw new Error("Error updating cart item");
        }

        await response.json(); // No es necesario usar la respuesta aquí
        fetchCart(); // Recargar el carrito desde el servidor
      } catch (error) {
        console.error("Error updating cart item:", error);
      }
    }
  };

  const handleRemoveProduct = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/carrito/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error deleting cart item");
      }

      await response.json(); // No es necesario usar la respuesta aquí
      fetchCart(); // Recargar el carrito desde el servidor
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800">Tu Carrito</h1>

        {cart.length === 0 ? (
          <p className="mt-4 text-xl text-gray-600">Tu carrito está vacío.</p>
        ) : (
          <div>
            <ul>
              {cart.map((item) => (
                <li key={item.id} className="bg-white border rounded-lg p-4 shadow mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={item.image_url}
                        alt={item.nombre}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="ml-4">
                        <h2 className="font-semibold text-lg">{item.name}</h2>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <p className="text-xl font-semibold mt-2">${item.price}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleDecreaseQuantity(item.id)}
                        className="bg-gray-200 p-2 rounded-md"
                      >
                        -
                      </button>
                      <span>{item.cantidad}</span>
                      <button
                        onClick={() => handleIncreaseQuantity(item.id)}
                        className="bg-gray-200 p-2 rounded-md"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemoveProduct(item.id)}
                        className="bg-red-500 text-white p-2 rounded-md"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-xl font-semibold">
              Total: ${total}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}