import { Banner } from '@/components/Banner';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <Banner />
            </main>
            <Footer />
        </div>
    );
}