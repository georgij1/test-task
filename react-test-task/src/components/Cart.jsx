import React from "react"
import { getProducts } from "../services/api"
import { ColorCircle, ImageSlider } from "./DetailsProduct";
import { Link } from "react-router-dom";

export const Cart = () => {
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        getProducts().then(products => {
            const allData = products.map(item => 
                JSON.parse(localStorage.getItem(item.id))
            ).filter(Boolean);
            
            setData(allData);
        });
    }, []);

    return (
        <div>
            <div className="header">
                <Link to={"/"}>Список товаров</Link>
                <Link to={"/cart"}>Корзина</Link>
            </div>
            {
                data.length ? <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)'
                }}>
                    {data.map(item => (
                        <div>
                            <ImageSlider images={item.image} />
                            <div>{item.name}</div>
                            <div><ColorCircle colorName={item.color_name} colorId={item.color_id} productId={item.product_id}/></div>
                            <div>{item.size}</div>
                            <div>{item.price}</div>
                            <button style={{color: 'red'}} onClick={() => {
                                localStorage.removeItem(item.product_id)
                                window.location.reload()
                            }}>Удалить</button>
                        </div>
                    ))}
                </div> : <div>Корзина пустая</div>
            }
        </div>
    )
}