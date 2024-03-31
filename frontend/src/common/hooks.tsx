import { useContext, useEffect, useState } from "react";
import { AuthData, Offer, Product, Review, User, UserRole } from "../models/models";
import fetcher, { base64Encode } from "./utils";
import { appConfig } from "../config";
import useSWR, { Fetcher } from "swr";
import { AuthDataContext } from "../App";
import React, { useRef } from 'react';


/* Returns a string that can be used as image src for the product's image; string empy if image is not set */
export function useProductImage(product: Product | undefined) {

    const [imageSrcString, setImageSrcString] = useState("")

    useEffect(() => {
        //console.log("product image base64", base64Encode(product.image.img.data.data))
        if (product?.image?.img?.data?.data) {
            const imageBase64 = base64Encode(product.image.img.data.data)
            setImageSrcString(`data:${product.image.img.contentType};base64,${imageBase64}`)
        }

    }, [product?.image])

    return imageSrcString

}

const userFetcher: Fetcher<User, [string, AuthData]> = async ([url, authData]) => {

    const res = await fetch(`${url}/${authData.user}`, {
        headers: {
            Authorization: `Bearer ${authData.token}`
        }
    },
    )
    return res.json()

}

//first param is url string, second is token; url should include any query parameters like id
async function fetcherWithAuth([url, token]: [string, string]) {
    if(token){
        // console.log("about to fetch", url)
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        },
        )
        return res.json()
    }else{
        console.error(`Token was empty for request to url: ${url}`)
    }
    
    
}

//only fetch details for logged in users
export function useCurrentUserDetails() {
    const {authData} = useContext(AuthDataContext)
    const path = authData?.userRole === UserRole.Admin ? 'admin' : 'customer'
    const { data, isLoading , mutate: refreshUser} = useSWR<User>(authData ? [`${appConfig.baseUrl}/${path}/user/${authData.user}`, authData.token] : null, fetcherWithAuth)

    useEffect(() => {
        console.log("current user id", data?._id)
    }, [data])
    return {
        user: data,
        token: authData?.token,
        isLoading,
        refreshUser
    }
}

export function useIsAdmin(){
    const {authData} = useContext(AuthDataContext)
    return authData?.userRole === UserRole.Admin
}

//if isSeller is false, we query for offers of user as buyer id; when isSeller is true we query for offers of user as seller
export function useCurrentUserOffers(isSeller: boolean = false){
    const {user, token} = useCurrentUserDetails()
    const isAdmin = useIsAdmin()

    const { data, isLoading, mutate, isValidating } = useSWR<Offer[]>(user && !isAdmin ? [`${appConfig.baseUrl}/customer/offers?${isSeller ? 'sellerId' : 'buyerId'}=${user._id}`, token] : null, fetcherWithAuth)
    // console.log("token", token)
    // console.log("uid", user?._id)
    // console.log("offers query url", `${appConfig.baseUrl}/customer/offers?${isSeller ? 'sellerId' : 'buyerId'}=${user?._id}`)

    // console.log("offers", data)

    return {
        offers: data,
        isLoading,
        refresh: mutate,
        isValidating,
    }
}

//only for admin
export function useUserOffersById(id: string, isSeller: boolean = false){
    const {user, token} = useCurrentUserDetails()

    const { data, isLoading, mutate, isValidating } = useSWR<Offer[]>(user ? [`${appConfig.baseUrl}/admin/offers?${isSeller ? 'sellerId' : 'buyerId'}=${id}`, token] : null, fetcherWithAuth)
    // console.log("token", token)
    // console.log("uid", user?._id)
    // console.log("offers query url", `${appConfig.baseUrl}/customer/offers?${isSeller ? 'sellerId' : 'buyerId'}=${user?._id}`)

    // console.log("offers", data)

    return {
        offers: data,
        isLoading,
        refresh: mutate,
        isValidating,
    }
}
  
  export const useProducts = (productIds : string[] | undefined) => {
    const productsUrl = productIds && productIds.length ? `${appConfig.baseUrl}/products/multiple/${productIds?.join(",")}` : undefined;
  
    const { data: products, error, isLoading} = useSWR<Product[]>(productsUrl, fetcher);
  
    return {
      products,
      isLoading,
      error,
    };
  };

  //only for admin
  export const useUserDetailsWithId = (id: string) => {
    const {authData} = useContext(AuthDataContext)
    const { data, isLoading , mutate: refreshUser} = useSWR<User>(authData ? [`${appConfig.baseUrl}/admin/user/${id}`, authData.token] : null, fetcherWithAuth)

    useEffect(() => {
        console.log("current user id", data?._id)
    }, [data])
    return {
        user: data,
        isLoading,
        refreshUser
    }
}

  export const allUsers = () => {
    const userUrl = `${appConfig.baseUrl}/admin/users`;
  
    // const fetcher = async (userUrl: RequestInfo | URL) => {
    //   const response = await fetch(userUrl);
    //   const data = await response.json();
    //   return data;
    // };
  
    // const { data: users, error } = useSWR<User[]>(userUrl, fetcher);
    const {user, token} = useCurrentUserDetails()
    const { data: users, error } = useSWR<User[]>([userUrl, token], fetcherWithAuth);
  
    const isLoading = !users && !error;
  
    return {
      users,
      isLoading,
      error,
    };
  };

  export const allProducts = () => {
    const productUrl = `${appConfig.baseUrl}/products`;
  
    const fetcher = async (productUrl: RequestInfo | URL) => {
      const response = await fetch(productUrl);
      const data = await response.json();
      return data;
    };
  
    const { data: products, error } = useSWR<Product[]>(productUrl, fetcher);
  
    const isLoading = !products && !error;
  
    return {
      products,
      isLoading,
      error,
    };
  };

  
type ReviewQueryParams = {
    buyerId?: string,
    sellerId?: string,
    productId?: string,
}

//fetch reviews for current uwer 
export const useReviews = (params: ReviewQueryParams) => {

    const {user, token} = useCurrentUserDetails()

    const {buyerId, sellerId, productId} = params
    
    const baseUrl = `${appConfig.baseUrl}/reviews`

    const queryUrl = buyerId || sellerId || productId ? `${baseUrl}?${new URLSearchParams(params)}` : undefined
    //buyerId || sellerId || productId ? 
    const {data: reviews, mutate: refreshReviews, isLoading: reviewsLoading, isValidating: reviewsValidating, error} = useSWR<Review[]>(queryUrl && [queryUrl, token], fetcherWithAuth)

    return {reviews, refreshReviews, reviewsLoading, reviewsValidating, error}
}



interface ScrollContainerProps {
    children: React.ReactNode;
  }

const ScrollContainer: React.FC<ScrollContainerProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const containerTop = containerRef.current?.offsetTop || 0;
      const containerHeight = containerRef.current?.offsetHeight || 0;

      if (scrollTop >= containerTop && scrollTop < containerTop + containerHeight) {
        const scrollPercentage = (scrollTop - containerTop) / containerHeight;
        const aboutUsContent = containerRef.current?.querySelector('.about-us-content');
        if (aboutUsContent) {
          (aboutUsContent as HTMLElement).style.opacity = scrollPercentage.toString();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return <div ref={containerRef}>{children}</div>;
};

export default ScrollContainer;



