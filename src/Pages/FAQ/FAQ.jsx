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
    <div className="w-full max-w-[1290px] mx-auto py-10 min-h-screen px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
        Frequently Asked Questions
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`bg-gray-50 border border-gray-200 rounded-xl shadow-lg p-4 md:p-6 hover:border-warning transition-colors duration-200 ${
              activeIndices.includes(index) ? 'border-warning' : ''
            }`}
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="flex justify-between items-center w-full text-left font-semibold text-lg text-black hover:text-warning transition-colors duration-200"
            >
              <span className="text-base md:text-lg pr-4">{faq.question}</span>
              <span className="text-xl flex-shrink-0">
                {activeIndices.includes(index) ? '-' : '+'}
              </span>
            </button>
            
            <AnimatePresence>
              {activeIndices.includes(index) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="text-gray-600 mt-3 text-sm md:text-base">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}