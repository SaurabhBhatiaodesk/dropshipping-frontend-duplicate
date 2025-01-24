import React, { useCallback, useEffect } from "react";
import PageTitleBar from "../../Shared/PageTitleBar/PageTitleBar";

const Auth = () => {
  // const [data, setData] = useState(null);
  const callBackendAPI = async (s) => {
    console.log(s)
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth?shop=${s}`);
    const body = await response.json();

    if (response.status === 200) {
      // throw Error(body.message)
    }else{
      console.log(body.message)
      // throw Error(body.message)
    }
    return body;
  };

  const shopDetails = useCallback(async () => {
    const UrlParams = new URLSearchParams(window.location.search);
    // const params = Object.fromEntries(UrlParams)
    const shop = UrlParams.get('shop')
    console.log("shopshopshopshop", shop)
    if (shop) {
      
      const data = await callBackendAPI(shop);
      console.log("callBackendAPI data", data)
      if (data.status === 201) {
        console.log('URL: ',data.installUrl)
        window.open(data.installUrl, "_self")
        // setLoading(false)
      } else if (data.status === 200) {
        // dispatch(shopDetailsAction({ ...data.shop }));
        console.log(data);
        window.location = '/';
        // setLoading(false)
      } else {
        // setLoading(false)
      }
    }
  }, [])

  // const shopDetails = async () => {

  // }
  let isMounted = true;
  useEffect(() => {
    
    if(isMounted)
    {
      shopDetails();
    }  
    
    return () => {
      isMounted = false;
    };
  }, [shopDetails])


  return (
    <div className="Home-page-os">
    </div>
  );
};

export default Auth;
