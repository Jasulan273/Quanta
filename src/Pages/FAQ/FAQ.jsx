import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQ() {
  const [activeIndices, setActiveIndices] = useState([]);

  const faqs = [
    { question: 'What Does Royalty Free Mean?', answer: 'Royalty free means you can use the product without paying royalties or licensing fees.' },
    { question: 'How Do I Download A Product?', answer: 'You can download a product by navigating to the download section after purchase.' },
    { question: 'What Is Your Refund Policy?', answer: 'We offer refunds within 30 days of purchase if you are unsatisfied.' },
    { question: 'Can I Use The Product Commercially?', answer: 'Yes, you can use the product for both personal and commercial projects.' },
    { question: 'How Can I Contact Support?', answer: 'You can contact our support team via the support page or by emailing us at support@example.com.' },
    { question: 'Do You Offer Discounts?', answer: 'Yes, we occasionally offer discounts during special promotions. Keep an eye on our newsletter.' },
    { question: 'How Secure Is My Personal Information?', answer: 'We use industry-standard encryption to protect your personal data.' },
    { question: 'Is There A Subscription Model?', answer: 'No, we offer one-time purchases without the need for subscriptions.' },
  ];

  const toggleAccordion = (index) => {
    setActiveIndices((prevActiveIndices) =>
      prevActiveIndices.includes(index)
        ? prevActiveIndices.filter((i) => i !== index)
        : [...prevActiveIndices, index]
    );
  };

  return (
    <div className="w-container mx-auto py-10 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8">Frequently Asked Questions</h1>

      <div className="flex flex-wrap justify-between gap-6">
        <div className="flex-1 min-w-[48%]">
          {faqs.slice(0, Math.ceil(faqs.length / 2)).map((faq, index) => (
            <div
              key={index}
              className={`relative mb-8 bg-gray-50 border border-gray-200 rounded-xl shadow-lg p-4 hover:border-warning transition-colors duration-200 ${
                activeIndices.includes(index) ? 'border-warning' : ''
              }`}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="flex justify-between w-full text-left font-semibold text-lg text-black hover:text-warning transition-colors duration-200"
              >
                {faq.question}
                <span>{activeIndices.includes(index) ? '-' : '+'}</span>
              </button>
              <AnimatePresence>
                {activeIndices.includes(index) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mt-2"
                  >
                    <p className="text-gray-600">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
  
        <div className="flex-1 min-w-[48%]">
          {faqs.slice(Math.ceil(faqs.length / 2)).map((faq, index) => (
            <div
              key={index + Math.ceil(faqs.length / 2)}
              className={`relative mb-8 bg-gray-50 border border-gray-200 rounded-xl shadow-lg p-4 hover:border-warning transition-colors duration-200 ${
                activeIndices.includes(index + Math.ceil(faqs.length / 2)) ? 'border-warning' : ''
              }`}
            >
              <button
                onClick={() => toggleAccordion(index + Math.ceil(faqs.length / 2))}
                className="flex justify-between w-full text-left font-semibold text-lg text-black hover:text-warning transition-colors duration-200"
              >
                {faq.question}
                <span>{activeIndices.includes(index + Math.ceil(faqs.length / 2)) ? '-' : '+'}</span>
              </button>
              <AnimatePresence>
                {activeIndices.includes(index + Math.ceil(faqs.length / 2)) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mt-2"
                  >
                    <p className="text-gray-600">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
