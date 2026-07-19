import { useEffect, useState } from 'react';
import { getMenu, placeOrder } from './api.js';

export default function App() {
  const [menu, setMenu] = useState(null);
  const [menuError, setMenuError] = useState(null);
  const [pizza, setPizza] = useState('');
  const [toppings, setToppings] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMenu()
      .then((data) => {
        setMenu(data);
        setPizza(data.pizzas[0]);
      })
      .catch((err) => setMenuError(err.message));
  }, []);

  function toggleTopping(topping) {
    setToppings((current) =>
      current.includes(topping) ? current.filter((t) => t !== topping) : [...current, topping],
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    setError(null);
    try {
      const data = await placeOrder(pizza, toppings);
      setResult(data);
      setToppings([]);
    } catch (err) {
      setError({ message: err.message, name: err.name, traceId: err.traceId });
    } finally {
      setSubmitting(false);
    }
  }

  if (menuError) {
    return <div className="app-error">Couldn't load the menu: {menuError}</div>;
  }

  if (!menu) {
    return <div className="loading">Loading menu…</div>;
  }

  return (
    <div className="app">
      <h1>🍕 Pizza Shop</h1>

      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Choose your pizza</legend>
          {menu.pizzas.map((p) => (
            <label key={p} className="option">
              <input
                type="radio"
                name="pizza"
                value={p}
                checked={pizza === p}
                onChange={() => setPizza(p)}
              />
              {p}
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend>Add toppings</legend>
          {menu.toppings.map((t) => (
            <label key={t} className="option">
              <input
                type="checkbox"
                value={t}
                checked={toppings.includes(t)}
                onChange={() => toggleTopping(t)}
                data-faro-user-action-name="toggle-topping"
              />
              {t}
            </label>
          ))}
        </fieldset>

        <button type="submit" disabled={submitting} data-faro-user-action-name="place-order">
          {submitting ? 'Placing order…' : 'Place order'}
        </button>
      </form>

      {result && (
        <div className="banner success">
          <p>
            Order placed: <strong>{result.order.pizza}</strong>
            {result.order.toppings.length > 0 && ` with ${result.order.toppings.join(', ')}`}
          </p>
          <p className="trace-id">traceId: {result.traceId}</p>
        </div>
      )}

      {error && error.name === 'PineappleNotAllowedError' && (
        <div className="banner error">
          <p>🍍🚫 We don't allow pineapple on our pizzas.</p>
          <p className="trace-id">traceId: {error.traceId}</p>
        </div>
      )}

      {error && error.name !== 'PineappleNotAllowedError' && (
        <div className="banner error">
          <p>{error.message}</p>
          {error.traceId && <p className="trace-id">traceId: {error.traceId}</p>}
        </div>
      )}
    </div>
  );
}
