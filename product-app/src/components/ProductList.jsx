import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

const ProductList = () => {
    const [productList, setProductList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('')
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000); 
    const [filteredList, setFilteredList] = useState([])

    useEffect(() => {
        fetch('https://mocki.io/v1/e68a9f01-7cdc-4988-850c-fd65c531314c')
            .then(response => response.json())
            .then(data => {
                setProductList(data)
                const prices = data.map(product => product.price);
                setMinPrice(Math.min(...prices));
                setMaxPrice(Math.max(...prices));
            })
    }, []);

    useEffect(() => {
        let filtered = productList;
        if (searchTerm) {
            filtered = filtered.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
        }
        filtered = filtered.filter(product => product.price >= minPrice && product.price <= maxPrice);
        setFilteredList(filtered)

    }, [productList, searchTerm, minPrice, maxPrice])


    return (
        <div style={{ padding: '1.5rem' }}>

            <header style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '1.5rem'
            }}>
                <h1>Products List</h1>
            </header>
            <div style={{ display: 'flex', alignItems: 'space-between', gap: '1rem' }}>
                <Form.Control type='text' placeholder='Search a product' onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '40%' }} />
                <span>Price: ${minPrice} - ${maxPrice}</span>
                <input
                    type="range"
                    min="0"
                    max="1000"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                />
                <input
                    type="range"
                    min="0"
                    max="1000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
            </div>
            {filteredList.length === 0 ? (
                <p>Loading products...</p>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto auto auto auto',
                    gap: '1.25rem',
                    padding: '1.25rem'
                }}>
                    {filteredList.map((product) => (
                        <Card style={{ width: '18rem' }}>
                            <div key={product.id}>
                                <Card.Img
                                    src={product.image}
                                    alt={product.name}
                                    width="200"
                                    height="150"
                                    style={{ objectFit: 'cover', borderRadius: '0.5rem' }}
                                />
                                <Card.Body>
                                    <Card.Title>{product.name}</Card.Title>
                                    <Card.Text>
                                        <Card.Subtitle>Category: {product.category}</Card.Subtitle>
                                        <p>Price: ${product.price.toFixed(2)}</p>
                                    </Card.Text>
                                </Card.Body>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductList;
