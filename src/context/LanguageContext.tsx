'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

export const dictionary: Translations = {
  appName: { en: 'ROYAL SUPERMARKET', ar: 'سوبرماركت رويال' },
  slogan: { en: 'Freshness Delivered to Your Doorstep', ar: 'الطزاجة متوفرة حتى باب منزلك' },
  deliverTo: { en: 'Deliver to:', ar: 'التوصيل إلى:' },
  searchPlaceholder: { en: 'Search fresh fruits, vegetables, dairy...', ar: 'ابحث عن الفواكه الطازجة، الخضروات، الألبان...' },
  signIn: { en: 'Sign In', ar: 'تسجيل الدخول' },
  myOrders: { en: 'My Orders', ar: 'طلباتي' },
  cart: { en: 'Cart', ar: 'السلة' },
  getStarted: { en: 'Get Started', ar: 'ابدأ الآن' },
  welcomeBack: { en: 'Welcome Back!', ar: 'أهلاً بعودتك!' },
  loginOrRegister: { en: 'Login or register to continue', ar: 'سجل الدخول أو أنشئ حساباً للمتابعة' },
  mobileNumber: { en: 'MOBILE NUMBER', ar: 'رقم الجوال' },
  sendOtp: { en: 'Send OTP', ar: 'إرسال الرمز' },
  selectLocation: { en: 'Select Location', ar: 'تحديد الموقع' },
  useCurrentLocation: { en: 'Use Current Location', ar: 'استخدام الموقع الحالي' },
  chooseOnMap: { en: 'Choose on Map', ar: 'الخيارات على الخريطة' },
  confirmLocation: { en: 'Confirm Location', ar: 'تأكيد الموقع' },
  deliveryAddress: { en: 'Delivery Address', ar: 'عنوان التوصيل' },
  saveAddress: { en: 'Save Address', ar: 'حفظ العنوان' },
  addressSaved: { en: 'Address Saved Successfully!', ar: 'تم حفظ العنوان بنجاح!' },
  startShopping: { en: 'Start Shopping', ar: 'ابدأ التسوق' },
  
  // Key Benefits
  keyBenefits: { en: 'KEY BENEFITS', ar: 'المميزات الرئيسية' },
  veryEasy: { en: 'Very Easy for Everyone', ar: 'سهل جداً للجميع' },
  lessTyping: { en: 'Less Typing, More Automation', ar: 'كتابة أقل، أتمتة أكثر' },
  accurateLocation: { en: 'Accurate Location with Map', ar: 'موقع دقيق بالخريطة' },
  fasterCheckout: { en: 'Faster Checkout Experience', ar: 'تجربة دفع أسرع' },
  betterExperience: { en: 'Better Experience for Elders & All Users', ar: 'تجربة أفضل لكبار السن والجميع' },
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key,
  dir: 'ltr',
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('royal_lang') as Language;
    if (saved === 'en' || saved === 'ar') {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('royal_lang', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const t = (key: string): string => {
    if (dictionary[key]) {
      return dictionary[key][lang] || dictionary[key]['en'];
    }
    return key;
  };

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      <div dir={dir} className={lang === 'ar' ? 'font-arabic' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
