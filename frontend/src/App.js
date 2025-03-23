import React, { useState, useEffect } from "react";
import axios from "axios";

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
      // 서버에 주문 요청 보내기
      const response = await axios.post("http://localhost:5012/api/order", {
        items: cart,
      });
      console.log("주문 성공:", response.data);
      alert("✅ 주문 완료!");

      // 주문 완료 후 최신 주문 내역을 가져오기
      setOrder(response.data); // 바로 최신 주문을 'order' 상태에 설정
      setCart([]); // 주문 후 장바구니 비우기
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

    // 최초 렌더링 시에만 주문 내역을 가져옴
    fetchOrder();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>☕ 주문 시스템</h1>

      <h2 style={styles.cartTitle}>🛒 장바구니</h2>
      {/* 장바구니가 비어있지 않으면 주문 목록을 보여주고, 비어 있으면 "장바구니가 비어 있습니다." 메시지를 표시 */}
      <ul style={styles.cartList}>
        {cart.length === 0 ? (
          <li style={styles.cartItem}>장바구니에 담긴 항목이 없습니다.</li>
        ) : (
          cart.map((item, index) => (
            <li key={index} style={styles.cartItem}>
              {item.name} - {item.price}원
            </li>
          ))
        )}
      </ul>

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

      <button onClick={placeOrder} style={styles.orderButton}>
        {isLoading ? "주문 중..." : "📦 주문하기"}
      </button>

      {/* 주문 내역이 있다면 출력 */}
      {order && order.items && (
        <div style={styles.orderSummary}>
          <h2>📜 최근 주문 내역</h2>
          <p>
            🛒 주문 항목: {order.items.map((item) => item.name).join(", ")}
          </p>{" "}
          {/* 주문 항목 */}
          <p>💰 총 금액: {order.totalPrice}원</p> {/* 총 금액 */}
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
  cartTitle: {
    fontSize: "24px",
    color: "#555",
    marginBottom: "15px",
  },
  cartList: {
    listStyleType: "none",
    padding: 0,
  },
  cartItem: {
    fontSize: "18px",
    marginBottom: "8px",
    color: "#444",
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
  itemButtonHover: {
    backgroundColor: "#45a049",
  },
  orderButton: {
    padding: "15px 40px",
    fontSize: "18px",
    marginTop: "20px",
    backgroundColor: "#ff6347",
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
