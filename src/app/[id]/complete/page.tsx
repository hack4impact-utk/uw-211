import Footer from '@/components/Footer';
import Header from '@/components/Header';

const Check = ({ className }: { className?: string }) => {
  return (
    <svg
      version="1.1"
      id="check"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 305.002 305.002"
      xmlSpace="preserve"
      className={className}
    >
      <g>
        <g>
          <path
            d="M152.502,0.001C68.412,0.001,0,68.412,0,152.501s68.412,152.5,152.502,152.5c84.089,0,152.5-68.411,152.5-152.5
			S236.591,0.001,152.502,0.001z M152.502,280.001C82.197,280.001,25,222.806,25,152.501c0-70.304,57.197-127.5,127.502-127.5
			c70.304,0,127.5,57.196,127.5,127.5C280.002,222.806,222.806,280.001,152.502,280.001z"
          />
          <path
            d="M218.473,93.97l-90.546,90.547l-41.398-41.398c-4.882-4.881-12.796-4.881-17.678,0c-4.881,4.882-4.881,12.796,0,17.678
			l50.237,50.237c2.441,2.44,5.64,3.661,8.839,3.661c3.199,0,6.398-1.221,8.839-3.661l99.385-99.385
			c4.881-4.882,4.881-12.796,0-17.678C231.269,89.089,223.354,89.089,218.473,93.97z"
          />
        </g>
      </g>
    </svg>
  );
};

export default async function Complete() {
  return (
    <>
      <header>
        <Header className="fixed top-0" />
      </header>

      <main className="flex h-screen w-screen flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-8">
          <Check className="w-1/2 fill-blue-700 md:w-3/4" />
          <h1 className="text-3xl font-bold">Thank You!</h1>
          <p className="text-center text-lg">
            Your submission has been received. <br />
            <span className="text-sm text-gray-500">
              You can now safely close this page.
            </span>
          </p>
        </div>
      </main>

      <footer>
        <Footer className="fixed bottom-3 py-2" />
      </footer>
    </>
  );
}
