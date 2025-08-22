import { Button } from '@/components/ui/button';
import { Mountain, Target, Shield, Users, Heart, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white w-screen overflow-x-hidden">
      {/* Hero Section - Clean Title Style */}
      <div className="w-screen pt-32 pb-16">
        <div className="w-full flex justify-center items-center">
          <h1 className="overspray-title text-white text-6xl lg:text-8xl text-center">
            ABOUT KHOROSAN
          </h1>
        </div>
      </div>

      {/* Palestine Support Mission */}
      <section className="py-24 bg-gradient-to-r from-black via-blue-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="overspray-title text-white text-4xl lg:text-6xl mb-6">
              OUR MISSION
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="palestine-support mb-8">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <Heart className="h-8 w-8 text-red-500" />
                  <h3 className="overspray-title text-white text-2xl">25% FOR PALESTINE</h3>
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
                <p className="text-xl text-gray-200 leading-relaxed">
                  Every purchase you make directly supports our brothers and sisters in Palestine. 
                  25% of all profits go to humanitarian aid through trusted Islamic organizations.
                </p>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed">
                Khorosan is more than a clothing brand - it's a movement rooted in Islamic values, 
                supporting the Ummah while providing premium quality garments for the modern Muslim.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="overspray-title text-white text-3xl lg:text-4xl mb-6">
                OUR STORY
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Founded in 2020 with a vision rooted in Islamic principles, Khorosan emerged from 
                  a desire to create clothing that reflects our values while supporting our Ummah. 
                  Our name, derived from the historical region known for its Islamic heritage and 
                  the prophetic traditions associated with it, reflects our commitment to excellence.
                </p>
                <p>
                  We recognized the need for premium clothing that serves the modern Muslim - 
                  garments that transition seamlessly from prayer to work, from outdoor adventures 
                  to community gatherings, all while maintaining the highest standards of modesty 
                  and quality.
                </p>
                <p>
                  Every piece in our collection is designed with purpose, tested for durability, 
                  and created to serve both your worldly needs and your commitment to supporting 
                  the Palestinian cause.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-80 h-80 lg:w-96 lg:h-96">
                <img
                  src="/arabic.jpg"
                  alt="Inspiration from Gaza"
                  className="w-full h-full object-cover rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-500"
                />
                <p className="text-sm text-gray-400 mt-2 text-center italic">
                  Inspiration from the resilient walls of Gaza
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Islamic Values */}
      <section className="py-24 bg-black w-screen">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="overspray-title text-white text-4xl lg:text-6xl mb-4">
              OUR VALUES
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Principles rooted in Islamic teachings that guide everything we do
            </p>
          </div>

          <div className="w-full flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl w-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8" />
                </div>
                <h3 className="text-xl text-white mb-2">Ummah Support</h3>
                <p className="text-gray-300">
                  Supporting our Palestinian brothers and sisters through every purchase.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8" />
                </div>
                <h3 className="text-xl text-white mb-2">Excellence</h3>
                <p className="text-gray-300">
                  Pursuing Ihsan in everything we create - perfection in worship and work.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-xl text-white mb-2">Modesty</h3>
                <p className="text-gray-300">
                  Designs that honor Islamic principles of modesty while maintaining style.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8" />
                </div>
                <h3 className="text-xl text-white mb-2">Global Ummah</h3>
                <p className="text-gray-300">
                  Connecting Muslims worldwide through quality and shared values.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Islamic Heritage Section */}
      <section className="py-24 bg-gradient-to-r from-black via-blue-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="overspray-title text-white text-4xl lg:text-6xl mb-6">
              KHOROSAN HERITAGE
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="text-xl lg:text-2xl text-gray-200 leading-relaxed italic border-l-4 border-blue-500 pl-6 mb-8">
                                
              </div>
              <p className="text-lg text-gray-300 leading-relaxed">
                Our brand draws inspiration from the rich Islamic heritage of the Khorosan region, 
                known for its scholars, warriors, and unwavering faith. We carry this legacy forward 
                in every thread, every design, and every act of charity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action with MATW Logo */}
      <section className="py-24 bg-black w-screen">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="overspray-title text-white text-4xl lg:text-6xl mb-6">
              JOIN OUR MISSION
            </h2>
            
            {/* 25% Palestine statement with MATW logo inline */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-4 mb-8">
              <h3 className="text-3xl lg:text-4xl text-white">
                25% OF ALL PROFITS GO TO PALESTINE
              </h3>
              <div className="flex-shrink-0">
              </div>
            </div>
            
            <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-4xl mx-auto">
              When you choose Khorosan, you're not just buying clothing - you're supporting 
              Palestine, upholding Islamic values, and joining a community committed to making 
              a difference in the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-primary">
                <Heart className="h-5 w-5 mr-2" />
                Shop for Palestine
              </Button>
              <Button size="lg" variant="outline" className="btn-secondary">
                Learn More About Our Impact
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}