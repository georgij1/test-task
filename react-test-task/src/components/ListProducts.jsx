import React from "react";
import {getProducts} from "../services/api";
import { Link } from "react-router-dom";

const ColorCircle = ({ colorName }) => {
    const colorMap = {
        "черный": "black",
        "белый": "white",
        "серый": "grey",
        "желтый": "yellow",
        "синий": "blue"
    };

    const hexColor = colorMap[colorName.toLowerCase()];

    return (
        <div className="color_circle" style={{ backgroundColor: hexColor }}></div>
    );
};

export const ListProducts = () => {
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        setLoading(true);
        getProducts()
          .then((data) => {
            setProducts(data);
            console.log(data)
          })
          .finally(() => {
            setLoading(false);
          });
    }, []);

    if (loading) {
        return <div>Загрузка товаров...</div>;
    }
    
    return (
        <div>
            <div className="header">
                <Link to={"/cart"}>Корзина</Link>
            </div>
            <div className="cards">
                {products.map((product) => (
                    <div key={product.id} className="card" onClick={() => {
                        window.open('/product/'+product.id, '_self')
                    }}>
                        <img src={product.colors[0].images[0]} />
                        <div>{product.name}</div>
                        <div>{product.colors[0].description}</div>
                        <div className="bottom_card">
                            {product.colors[0] && <ColorCircle colorName={product.colors[0].name} />}
                            <div>{product.colors[0].price}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}