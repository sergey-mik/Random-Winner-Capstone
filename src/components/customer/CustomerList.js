// Import the required hooks and constants
import { useEffect, useState, useMemo } from 'react';
const API_BASE_URL = 'http://localhost:8088';

export const CustomerList = () => {
  // Declare state variables for clients, products, and bids
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [bids, setBids] = useState([]);

  // Define the getAllProducts function to fetch products from the API
  const getAllProducts = async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    const productObject = await response.json();
    setProducts(productObject);
  };

  // Define the getProductsBids function to fetch bids from the API
  const getProductsBids = async () => {
    const response = await fetch(`${API_BASE_URL}/productBids`);
    const productBidsObject = await response.json();
    setBids(productBidsObject);
  };

  // Use the useEffect hook to fetch products and bids when the component mounts
  useEffect(() => {
    (async () => {
      await getAllProducts();
      await getProductsBids();

      const response = await fetch(`${API_BASE_URL}/customers`);
      const employeeArray = await response.json();
      setClients(employeeArray);
    })();
  }, []);

  // Calculate the ClientInfo using the useMemo hook for memoization
  const ClientInfo = useMemo(() => {
    return products.map((product) => {
      if (product.productWon) {
        bids.forEach((bid) => {
          if (
            bid.productId === product.id &&
            product.productWon === bid.cellOrder
          ) {
            clients.forEach((client) => {
              if (bid.userId === client.userId) {
                product.wonClientInfo = client
              }
            })
          }
        })
      }
      return product
    })
  }, [products, bids, clients])

  // Define the ProductInfo component to display product information
  const ProductInfo = ({ product }) => {
    if (!product.wonClientInfo) return null;

    return (
      <article className="pb3" key={product.id}>
        <hr />
        <div className="pl4 pb1 tl">Product Name: {product.name}</div>
        <div className="pl5 tl">Client Name: {product.wonClientInfo.fullName}</div>
        <div className="pl5 tl">Client Address: {product.wonClientInfo.address}</div>
        <div className="pl5 tl">Client Email: {product.wonClientInfo.email}</div>
      </article>
    );
  };

  // Render the section with the Ready To Ship message and the list of products with their related client information
  return (
    <>
      <section className="measure center shadow br3 ma3 grow bw3">
        <h2 className="mt4 pt3">Ready To Ship</h2>

        <article>
          {ClientInfo.map((product) => (
            <ProductInfo key={product.id} product={product} />
          ))}
        </article>
      </section>
    </>
  );
};
