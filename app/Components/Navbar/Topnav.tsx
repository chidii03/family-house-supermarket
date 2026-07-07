import Link from "next/link";

export default function Topnav () {
  return (
    <div className="w-full bg-(--prim-color) text-sm text-white border-b border-red-200">
      <div className="flex items-center justify-between gap-1.5 py-2.5 px-[5%] lg:px-[8%] flex-col md:flex-row max-w-360 mx-auto">
        <div className="flex space-x-4 flex-wrap justify-center" >
         <Link href="/UI-Components/Pages/about" className="pr-3 border-r border-white/70 font-semibold hover:text-red-100">About Us</Link>
          <Link href="/ShopAll" className="pr-3 border-r border-white/70 font-semibold hover:text-red-100">Shop Groceries</Link>
           <Link href="/track" className="pr-3 border-white/70 font-semibold hover:text-red-100">Track Order</Link>
        </div>
        <div className="flex space-x-4 flex-wrap justify-center">
            <Link href="/Help" className="pr-3 border-r border-white/70 font-semibold hover:text-red-100">Help</Link>
              <Link href="/return-policy" className="font-semibold hover:text-red-100">Return Policy</Link>
       </div>
      </div>
    </div>
  )
}
