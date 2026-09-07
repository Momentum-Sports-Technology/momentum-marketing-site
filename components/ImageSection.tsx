import Image from "next/image";

export default function ImageSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/images/netball-players.jpg" // Path from /public directory
              alt="Momentum Netball players"
              fill
              className="object-cover"
              priority={false}
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-4xl font-bold mb-4">Your Content Here</h2>
            <p className="text-gray-600 text-lg">Example of how to use images in your site.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
