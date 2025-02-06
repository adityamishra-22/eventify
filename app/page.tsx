import Footer from "@/components/Footer";
import FormSubmitModal from "@/components/FormSubmitModal";
import MainHeader from "@/components/MainHeader";
import SideBar from "@/components/SideBar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="border-b-[0.1rem] border-grey-100">
      <MainHeader/>
      <div className="py-[1rem] px-[4rem] font-inter text-2xl font-bold leading-[31.2px] text-left decoration-skip-ink-none ">Create new Activity</div>
      <SideBar/>
      <Footer/>
    </div>
  );
}

