// app/auctions/new/page.tsx
import { cookies } from 'next/headers';
import NewAuctionClient from './newAuctionClient';

export default async function NewAuctionPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
    console.log(token)
  return <NewAuctionClient token={token} />;
}3
