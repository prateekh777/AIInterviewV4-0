import React from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Search,
  MapPin,
  Briefcase,
  Building,
  Users,
  Clock,
  BriefcaseBusiness,
  CheckCircle,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Home: React.FC = () => {
  const [, navigate] = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary-light bg-opacity-30 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                Find Your Dream Job with <span className="text-primary">Brivio</span>
              </h1>
              <p className="text-lg text-neutral-600 mb-8">
                Search through thousands of job listings to find the perfect match for your skills and aspirations.
              </p>
              <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                <div className="flex-grow relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    className="pl-10 pr-3 py-3 w-full rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <Button
                  className="py-3 px-6"
                  onClick={() => navigate("/jobs")}
                >
                  Find Jobs
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <Badge variant="outline" className="bg-white">
                  Remote
                </Badge>
                <Badge variant="outline" className="bg-white">
                  Full-time
                </Badge>
                <Badge variant="outline" className="bg-white">
                  Part-time
                </Badge>
                <Badge variant="outline" className="bg-white">
                  Contract
                </Badge>
                <Badge variant="outline" className="bg-white">
                  Internship
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Why Choose <span className="text-primary">Brivio</span>
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Our platform makes it easy to find and apply for jobs that match your skills and career goals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-neutral-50 p-6 rounded-lg">
                <div className="h-12 w-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Job Search</h3>
                <p className="text-neutral-600">
                  Filter jobs by location, experience level, job type, and more to find the perfect match.
                </p>
              </div>

              <div className="bg-neutral-50 p-6 rounded-lg">
                <div className="h-12 w-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                  <BriefcaseBusiness className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">One-Click Apply</h3>
                <p className="text-neutral-600">
                  Apply to multiple jobs quickly with our streamlined application process.
                </p>
              </div>

              <div className="bg-neutral-50 p-6 rounded-lg">
                <div className="h-12 w-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Track Applications</h3>
                <p className="text-neutral-600">
                  Keep track of all your job applications in one place and never miss an opportunity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <section className="py-16 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold">
                Featured <span className="text-primary">Jobs</span>
              </h2>
              <Button
                variant="link"
                className="text-primary"
                onClick={() => navigate("/jobs")}
              >
                View all jobs <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Job Card 1 */}
              <div className="bg-white rounded-lg border border-neutral-200 p-5 hover:shadow-md transition duration-150 cursor-pointer"
                onClick={() => navigate("/jobs/1")}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mr-3">
                      <i className="fas fa-bezier-curve"></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-800">UI / UX Designer</h3>
                      <p className="text-sm text-neutral-500">$95K - $120K</p>
                    </div>
                  </div>
                  <button className="text-neutral-400 hover:text-primary">
                    <i className="far fa-heart"></i>
                  </button>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center text-sm text-neutral-600">
                    <Building className="w-4 h-4 mr-2 text-neutral-400" />
                    <span>Laborum</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <MapPin className="w-4 h-4 mr-2 text-neutral-400" />
                    <span>Tucson, AZ</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <Briefcase className="w-4 h-4 mr-2 text-neutral-400" />
                    <span>Onsite</span>
                  </div>
                </div>
              </div>

              {/* Job Card 2 */}
              <div className="bg-white rounded-lg border border-neutral-200 p-5 hover:shadow-md transition duration-150 cursor-pointer"
                onClick={() => navigate("/jobs/2")}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-md bg-white border border-neutral-200 flex items-center justify-center text-primary mr-3">
                      <i className="fas fa-user-plus"></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-800">Senior UX/UI Designer</h3>
                      <p className="text-sm text-neutral-500">$110K - $135K</p>
                    </div>
                  </div>
                  <button className="text-neutral-400 hover:text-primary">
                    <i className="far fa-heart"></i>
                  </button>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center text-sm text-neutral-600">
                    <Building className="w-4 h-4 mr-2 text-neutral-400" />
                    <span>Laborum</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <MapPin className="w-4 h-4 mr-2 text-neutral-400" />
                    <span>Columbus, OH</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <Briefcase className="w-4 h-4 mr-2 text-neutral-400" />
                    <span>Hybrid</span>
                  </div>
                </div>
              </div>

              {/* Job Card 3 */}
              <div className="bg-white rounded-lg border border-neutral-200 p-5 hover:shadow-md transition duration-150 cursor-pointer"
                onClick={() => navigate("/jobs/3")}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center text-white mr-3">
                      <i className="fas fa-font"></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-800">UX Copywriter</h3>
                      <p className="text-sm text-neutral-500">$70K - $85K</p>
                    </div>
                  </div>
                  <button className="text-neutral-400 hover:text-primary">
                    <i className="far fa-heart"></i>
                  </button>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center text-sm text-neutral-600">
                    <Building className="w-4 h-4 mr-2 text-neutral-400" />
                    <span>ABC</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <MapPin className="w-4 h-4 mr-2 text-neutral-400" />
                    <span>Tulsa, OK</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <Briefcase className="w-4 h-4 mr-2 text-neutral-400" />
                    <span>Remote</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Companies Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Top <span className="text-primary">Companies</span> Hiring Now
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Find your next career opportunity at one of these leading companies.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {/* Company logos would go here */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-neutral-50 rounded-lg p-6 flex items-center justify-center h-24"
                >
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mb-2">
                      <Building className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium">Company {i}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              Ready to Find Your Dream Job?
            </h2>
            <p className="max-w-2xl mx-auto mb-8">
              Join thousands of job seekers who have found their perfect career match on Brivio.
            </p>
            <Button
              variant="secondary"
              className="bg-white text-primary hover:bg-neutral-100"
              size="lg"
              onClick={() => navigate("/sign-up")}
            >
              Get Started Now
            </Button>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                What Our <span className="text-primary">Users</span> Say
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Hear from people who have found jobs using Brivio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-neutral-600 mb-6">
                  "I found my dream job at a tech startup using Brivio. The platform made it easy to filter jobs and apply quickly."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-neutral-200 mr-3"></div>
                  <div>
                    <h4 className="font-medium">Sarah Johnson</h4>
                    <p className="text-sm text-neutral-500">UI Designer</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-neutral-600 mb-6">
                  "As a recent graduate, I was worried about finding a job. Brivio made the process so much easier with their user-friendly interface."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-neutral-200 mr-3"></div>
                  <div>
                    <h4 className="font-medium">Michael Rodriguez</h4>
                    <p className="text-sm text-neutral-500">Software Engineer</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-neutral-600 mb-6">
                  "I've used several job boards, but Brivio has the best features. I especially love the ability to track all my applications."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-neutral-200 mr-3"></div>
                  <div>
                    <h4 className="font-medium">Emily Thompson</h4>
                    <p className="text-sm text-neutral-500">Marketing Manager</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
