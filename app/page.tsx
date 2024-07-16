import CarPart from "@/components/CarPart";
import Chat from "@/components/Chat";
import Navbar from "@/components/Navbar";
import Search from "@/components/Search";
import Sidebar from "@/components/Sidebar";

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
              </div>
              <div>
                <CarPart />
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <Chat />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
