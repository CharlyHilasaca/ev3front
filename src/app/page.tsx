"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/productos");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch("/api/user", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Error fetching user data");
          }

          const data = await response.json();
          setUser(data.user);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    const fetchCart = async () => {
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
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      }
    };

    fetchProducts();
    fetchUserData();
    fetchCart();
  }, []);

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch("/api/carrito", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ producto_id: product.id, cantidad: 1 }),
        });

        if (!response.ok) {
          throw new Error("Error adding product to cart");
        }

        const data = await response.json();
        setCart((prevCart) => [...prevCart, data]);
      } catch (error) {
        console.error("Error adding product to cart:", error);
      }
    } else {
      alert("Por favor, inicia sesión para agregar productos al carrito.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md py-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Bienvenido a nuestra tienda</h1>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-800 font-semibold">Hola, {user.nombre}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <a
                  href="/login"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
                >
                  Register
                </a>
              </div>
            )}
            <button
              onClick={() => router.push("/compras")}
              className="relative bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition"
            >
              <Image
                src="/cart-icon.png"
                alt="Carrito"
                width={24}
                height={24}
              />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
            >
              <Image
                src={product.image_url || "/placeholder.png"}
                alt={product.name}
                width={200}
                height={200}
                className="rounded-md mx-auto"
              />
              <h2 className="text-lg font-semibold mt-4 text-gray-800">{product.name}</h2>
              <p className="text-gray-600 text-sm mt-2">{product.description}</p>
              <p className="text-xl font-bold mt-4 text-gray-900">${product.price}</p>
              <button
                onClick={() => handleAddToCart(product)}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
              >
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}