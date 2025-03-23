import React, { useState, useEffect } from "react";
import axios from "axios";
import Cart from "./Cart"; // Cart 컴포넌트를 임포트

function App() {
  const [items, setItems] = useState([
    { name: "커피", price: 5000 },
    { name: "샌드위치", price: 3000 },
  ]);
  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("주문할 항목을 선택해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5012/api/order", {
        items: cart,
      });
      console.log("주문 성공:", response.data);
      alert("✅ 주문 완료!");
      setOrder(response.data);
      setCart([]); // 장바구니 비우기
    } catch (error) {
      console.error("주문 실패", error);
      alert("주문에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 주문 내역을 가져오는 useEffect
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get("http://localhost:5012/api/orders");
        if (response.data && response.data.length > 0) {
          setOrder(response.data[response.data.length - 1]); // 최신 주문 가져오기
        }
      } catch (error) {
        console.error("주문 내역을 불러오는 데 실패했습니다.", error);
      }
    };

    fetchOrder();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>☕ 주문 시스템</h1>

      {/* Cart 컴포넌트에 cart와 placeOrder 함수 전달 */}
      <Cart cart={cart} placeOrder={placeOrder} isLoading={isLoading} />

      <h3 style={styles.selectTitle}>아이템 선택</h3>
      <div style={styles.buttonContainer}>
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => addToCart(item)}
            style={styles.itemButton}
          >
            {item.name} ({item.price}원)
          </button>
        ))}
      </div>

      {/* 주문 내역 */}
      {order && order.items && (
        <div style={styles.orderSummary}>
          <h2>📜 최근 주문 내역</h2>
          <p>🛒 주문 항목: {order.items.map((item) => item.name).join(", ")}</p>
          <p>💰 총 금액: {order.totalPrice}원</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "30px",
    background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
    margin: "auto",
  },
  title: {
    fontSize: "32px",
    color: "#333",
    marginBottom: "20px",
  },
  selectTitle: {
    fontSize: "20px",
    marginTop: "20px",
    color: "#333",
  },
  buttonContainer: {
    marginTop: "15px",
  },
  itemButton: {
    padding: "12px 25px",
    margin: "5px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  orderSummary: {
    marginTop: "30px",
    padding: "20px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    border: "1px solid #ddd",
  },
};

export default App;
