import { useEffect } from 'react';

function OrderList({ userId }) {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');

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
      <input placeholder="Search" onChange={e => setSearch(e.target.value)} />
      {orders.map((o, i) => (
        <div key={i}>
          <span dangerouslySetInnerHTML={{ __html: o.customerNote }} />
          <button onClick={() => markShipped(i)}>Ship</button>
        </div>
      ))}
    </div>
  );
}

export default OrderList;
