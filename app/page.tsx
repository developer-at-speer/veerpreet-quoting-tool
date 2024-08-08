import Navbar from "@/components/Navbar";
import ParseExcel from "@/components/ParseExcel";
import Search from "@/components/Search";
import Sidebar from "@/components/Sidebar";
import Demo from "@/components/test";
import CarMakes from "@/components/test"
import { ChatProvider } from '@/components/ChatContext';

export default function Home() {
  return (
    <>
      <ChatProvider>
        <div>
          <Navbar />
          <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                  <Search />
                  {/* <Demo /> */}
                  {/* <CarMakes /> */}
                  {/* <ParseExcel /> */}
                </div>
              </div>
            </div>
          </div>
        </div>`
      </ChatProvider>
    </>
  );
}
