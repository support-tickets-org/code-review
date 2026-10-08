/**
 * Review [Critical]: useState is not imported -> import useState from react.
 */
import { useEffect } from 'react';

function OrderList({ userId }) {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');

  /**
   * Review [Critical]: useEffect missing dependency array -> add dependency array to avoid infinite re-renders.
   */
  useEffect(() => {
    fetch(`/api/orders?user=${userId}&q=${search}`)
      .then(r => r.json())
      .then(data => setOrders(data));
  });

  const markShipped = (index) => {
    orders[index].status = 'shipped';
    setOrders(orders);
    fetch(`/api/orders/${orders[index].id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'shipped' }),
    });
  };

  return (
    <div>
      {/* Review [Critical]: setSearch is not defined -> define setSearch using useState. */}
      <input placeholder="Search" onChange={e => setSearch(e.target.value)} />
      {orders.map((o, i) => (
        <div key={i}>
          {/* Review [Critical]: dangerouslySetInnerHTML is used -> sanitize the HTML to prevent XSS attacks. */}
          <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(o.customerNote) }} />
          <button onClick={() => markShipped(i)}>Ship</button>
        </div>
      ))}
    </div>
  );
}

export default OrderList;
