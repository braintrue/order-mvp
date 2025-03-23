import React from "react";

const Cart = ({ cart, placeOrder, isLoading }) => {
  return (
    <div>
      <h2>🛒 장바구니</h2>
      <ul>
        {cart.length === 0 ? (
          <li>장바구니에 담긴 항목이 없습니다.</li>
        ) : (
          cart.map((item, index) => (
            <li key={index}>
              {item.name} - {item.price}원
            </li>
          ))
        )}
      </ul>
      <button onClick={placeOrder} disabled={isLoading}>
        {isLoading ? "주문 중..." : "📦 주문하기"}
      </button>
    </div>
  );
};

export default Cart;
