export default async function fetcher<JSON = any>(
    input: RequestInfo,
    init?: RequestInit
  ): Promise<JSON> {
    const res = await fetch(input, init)
    return res.json()
  }

export const base64Encode = (data: Buffer) => {
  if(data.length <= 100000){
      return btoa(String.fromCharCode(...new Uint8Array(data)));
  }else{
      return ""
  }

  
};