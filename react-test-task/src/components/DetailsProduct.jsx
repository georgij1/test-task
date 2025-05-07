import { Link, useParams } from 'react-router-dom';
import {getSize, getProduct, getProductColor, getSizes, getProducts} from "../services/api";
import React from 'react';

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [imageSource, setImageSource] = React.useState([]);
  const [actualColorName, setActualColorName] = React.useState('');
  const [actualColorId, setActualColorId] = React.useState(0)

  return (
    <GlobalContext.Provider value={{ 
      description, setDescription,
      price, setPrice,
      imageSource, setImageSource,
      actualColorName, setActualColorName,
      actualColorId, setActualColorId
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobal = () => React.useContext(GlobalContext);

export const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div style={{ position: 'relative', width: '350px' }}>
      <div>
        <img 
          src={images[currentIndex]} 
          alt={`Slide ${currentIndex}`}
          style={{ width: '100%', display: 'block' }}
        />
      </div>
      
      <button 
        onClick={goToPrevious}
        style={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          transform: 'translateY(-50%)',
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          border: 'none',
          padding: '10px',
          cursor: 'pointer'
        }}
      >
        &lt;
      </button>
      
      <button 
        onClick={goToNext}
        style={{
          position: 'absolute',
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%)',
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          border: 'none',
          padding: '10px',
          cursor: 'pointer'
        }}
      >
        &gt;
      </button>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginTop: '10px' 
      }}>
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: index === currentIndex ? 'black' : 'gray',
              margin: '0 5px',
              cursor: 'pointer'
            }}
          />
        ))}
      </div>
    </div>
  );
}

export const ColorCircle = ({ colorName, colorId, productId }) => {
  const { setDescription, setPrice, setImageSource, actualColorName, setActualColorName, setActualColorId } = useGlobal();

  const colorMap = {
      "черный": "black",
      "белый": "white",
      "серый": "grey",
      "желтый": "yellow",
      "синий": "blue"
  };

  const hexColor = colorMap[colorName.toLowerCase()];

  if (!actualColorName) {
    getProductColor(productId, 1).then((data) => {
      setActualColorName(data.name)
      setActualColorId(data.id)
    })
  }

  return (
      <div className="color_circle" onClick={() => {      
        getProductColor(productId, colorId).then((data) => {
          setDescription(data.description)
          setPrice(data.price)
          setImageSource(data.images)
          setActualColorName(colorName)
          setActualColorId(colorId)
        })
      }} style={{ backgroundColor: hexColor }}></div>
  );
};

export const DetailsProduct = () => {
  const { description, price, imageSource, actualColorName, actualColorId } = useGlobal();
  const { id } = useParams();

  const [products, setProducts] = React.useState([]);
  const [size, setSize] = React.useState([]);
  const [sizes, setSizes] = React.useState([]);
  const [loadingProducts, setLoadingProducts] = React.useState(false);
  const [loadingSize, setLoadingSize] = React.useState(false);
  const [loadingSizes, setLoadingSizes] = React.useState(false);
  const [selectSize, setSelectSize] = React.useState('')
    
    React.useEffect(() => {
      getSize(id).then((data) => {
        setSize(data);
        setLoadingSize(true);
      })
      getSizes().then((data) => {
        setSizes(data);
        setLoadingSizes(true);
      })
      getProduct(id).then((data) => {
        setLoadingProducts(true)
        setProducts(data);
      })
      .finally(() => {
        setLoadingSize(false);
        setLoadingSizes(false);
        setLoadingProducts(false);
      });
    }, []);
    
    if (loadingProducts && loadingSize && loadingSizes) {
        return <div>Загрузка данных...</div>;
    }

    return (
        <div>
            <div className="header">
                <Link to={"/"}>Список товаров</Link>
                <Link to={"/cart"}>Корзина</Link>
            </div>
            {
              products.colors && Array.isArray(products.colors) && 
              size && sizes && Array.isArray(sizes) ? (
                <>
                  <div>
                    <ImageSlider images={!imageSource.length ? products.colors[0].images : imageSource} />
                  </div>
                  <div>{products.name}</div>
                  <div>{!description ? products.colors[0].description : description}</div>
                  <div className='select_color'>
                    {products.colors.map((color) => (
                      <ColorCircle colorName={color.name} colorId={color.id} productId={products.id}/>
                    ))}
                  </div>
                  <div>{!price ? products.colors[0].price : price}</div>
                  <div className='actual_size'>
                    <div>{selectSize == '' ? size.label : selectSize}</div>
                  </div>
                  <div className='options_card'>
                    <div className='all_sizes'>
                      {sizes.map((size_show, index) => (
                        size_show.label === size.label ? (
                          <div className='label_size' onClick={() => {setSelectSize(size_show.label)}}>{size_show.label}</div>
                        ) : <div className='label_size blur'>{size_show.label}</div>
                      ))}
                    </div>
                    <button onClick={() => {
                      localStorage.setItem(products.id, JSON.stringify({
                        "image": !imageSource.length ? products.colors[0].images : imageSource,
                        "name": products.name,
                        "color_name": actualColorName,
                        "color_id": actualColorId,
                        "product_id": products.id,
                        "size": selectSize == '' ? size.label : selectSize,
                        "price": !price ? products.colors[0].price : price
                      }))
                    }}>В корзину</button>
                  </div>
                </>
            ) : (
              <></>
            )}
        </div>
    )
}