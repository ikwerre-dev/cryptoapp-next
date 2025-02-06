import { Banner } from '@/components/Banner';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Features } from '@/components/Features';

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <Banner />
                <Features />
            </main>
            <Footer />
        </div>
    );
}