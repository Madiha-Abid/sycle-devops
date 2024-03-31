
export const conditionList = [{ value: 1, title: "1 - Poor" }, { value: 2, title: "2 - Fair" }, { value: 3, title: "3 - Average" }, { value: 4, title: "4 - Satisfactory" }, { value: 5, title: "5 - Good" }, { value: 6, title: "6 - Very Good" }, { value: 7, title: "7 - Excellent" }, { value: 8, title: "8 - Hardly Worn" }, { value: 9, title: "9 - Like New" }, { value: 10, title: "10 - New" }]
export const subCategoryList = ["Dress", "Shirt", "Jeans", "Ethnic", "Accessories", "Shoes"]
export const sizeList = ["Small", "Medium", "Large"]
export const coloursList = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Pink", "Brown", "Gray", "Black", "White", "Teal", "Magenta", "Turquoise", "Lime", "Navy", "Gold", "Silver", "Indigo", "Maroon", "Olive", "Crimson", "Violet", "Fuchsia", "Beige"]
export const cityList = ["Karachi", "Lahore", "Faisalabad", "Rawalpindi", "Multan", "Hyderabad", "Peshawar", "Quetta", "Islamabad", "Sialkot", "Sukkur", "Gujranwala", "Bahawalpur"]
export const categoryList = ["Mens", "Women"]
export const provinceList = ["Balochistan", "Khyber Pakhtunkhwa", "Punjab", "Sindh"]

export type Product = {
    _id: string,
    name: string,
    sellerId: string,
    address: {
        street_address: string,
        city: string,
        province: string,
        country: string,
        postal_code: string
    }
    location: {
        type: {
            type: string,
        },
        coordinates: {
            type: [Number],
        }
    },

    description: string,
    category: string,
    subCategory: string,
    price: number,
    condition: {
        type: number,
        min: 1,
        max: 10
    },
    size: string,
    brand: string,
    colour: string,
    image: {
        name: string,
        img: {
            data: {
                data: Buffer,
                type: string
            },
            contentType: String
        }
    },
    status: string,
    created_on: string
    updated_on: string
}

export type User = {
    _id: string,
    userRole: string,
    username: string,
    email: string,
    password: string,
    address: {
        street_address: string,
        city: string,
        province: string,
        country: string,
        postal_code: string
    },
    location: {
        type: string,
        coordinates: number
    },
    phone: string,
    listedProducts: string[],
    purchasedProducts: string[],
    created_on: Date,
    updated_on: Date
}

export type Offer = {
    _id: string
    sellerId: string,
    buyerId: string,
    productId: string,
    offerPrice: number,
    offerStatus: OfferStatus, //actually string from db
    created_on: Date,
    updated_on: Date
}

export enum OfferStatus {
    //'pending', 'approved', 'denied', 'canceled_by_buyer', 'accepted_by_buyer'
    Pending = 'pending',
    Approved = 'approved',
    Denied = 'denied',
    CancelledByBuyer = 'canceled_by_buyer',
    AcceptedByBuyer = "accepted_by_buyer"
}

export enum UserRole {
    Admin = 'admin',
    Customer = 'customer'
}

//This is the response received when we log in
export type AuthData = {
    user: string,
    token: string,
    userRole: UserRole
}

export type Review = {
    _id: string
    sellerId: string,
    buyerId: string,
    productId: string,
    reviews: string,
    rating: number,
    created_on: Date,
    updated_on: Date
}


