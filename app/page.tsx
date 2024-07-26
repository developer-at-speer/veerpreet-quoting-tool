import Navbar from "@/components/Navbar";
import ParseExcel from "@/components/ParseExcel";
import Search from "@/components/Search";
import Sidebar from "@/components/Sidebar";
import CarMakes from "@/components/test"



export default function Home() {
  return (
    <>
      <div>
        <Navbar />
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1 }}>
                <Search />
                <CarMakes />
                {/* <ParseExcel /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
