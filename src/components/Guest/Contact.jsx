import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-gray-50 dark:bg-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Contact Information & Form */}
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-black text-blue-900 dark:text-yellow-400 uppercase tracking-tighter mb-8">
              Get In Touch
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-12 text-lg">
              Have questions about enrollment or our CBC programmes? Visit our Ruiru campus or send us a message.
            </p>

            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-4 text-gray-700 dark:text-gray-200">
                <div className="w-12 h-12 bg-blue-900 rounded-xl flex items-center justify-center text-white">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </div>
                <span>Makindi Rd, Ruiru, Kiambu County</span>
              </div>
              <div className="flex items-center gap-4 text-gray-700 dark:text-gray-200">
                <div className="w-12 h-12 bg-blue-900 rounded-xl flex items-center justify-center text-white">
                  <FontAwesomeIcon icon={faPhone} />
                </div>
                <span>+254 20 3874950</span>
              </div>
            </div>

            <form className="space-y-4">
              <input type="text" placeholder="Your Name" className="w-full p-4 rounded-2xl bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 outline-none focus:ring-2 focus:ring-blue-900" />
              <textarea placeholder="Your Message" rows="4" className="w-full p-4 rounded-2xl bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 outline-none focus:ring-2 focus:ring-blue-900"></textarea>
              <button className="bg-blue-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-800 transition-all">
                <FontAwesomeIcon icon={faPaperPlane} /> Send Message
              </button>
            </form>
          </div>

          {/* Google Maps Integration */}
          <div className="lg:w-1/2 h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-700">
            <iframe 
              title="Makini School Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.847551066606!2d36.766553711200215!3d-1.2956121356075487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1212d7c8edbd%3A0x1496179b3c00993f!2sMakini%20Schools%20(CBC%20%26%20Cambridge)!5e0!3m2!1sen!2ske!4v1736500000000!5m2!1sen!2ske" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;