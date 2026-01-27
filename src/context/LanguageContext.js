'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
    EN: {
        home: 'Home',
        departments: 'Departments',
        services: 'Services',
        map: 'Hospital Map',
        contact: 'Contact',
        login: 'Login',
        heroTitle1: 'Smart Healthcare for a ',
        heroTitle2: 'Better Life',
        heroSubtitle: 'Experience the future of healthcare at Sheikh Khalifa Hospital. Our AI-powered assistant is here to guide you 24/7.',
        bookAppointment: 'Book Appointment',
        ourServices: 'Our Services',
    },
    AR: {
        home: 'الرئيسية',
        departments: 'الأقسام',
        services: 'الخدمات',
        map: 'خريطة المستشفى',
        contact: 'اتصل بنا',
        login: 'تسجيل الدخول',
        heroTitle1: 'رعاية صحية ذكية لـ ',
        heroTitle2: 'حياة أفضل',
        heroSubtitle: 'اختبر مستقبل الرعاية الصحية في مستشفى الشيخ خليفة. مساعدنا الذكي متاح لمساعدتك على مدار الساعة.',
        bookAppointment: 'حجز موعد',
        ourServices: 'خدماتنا',
    }
};

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState('EN');
    const [isRTL, setIsRTL] = useState(false);

    useEffect(() => {
        setIsRTL(lang === 'AR');
        document.documentElement.dir = lang === 'AR' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang.toLowerCase();
    }, [lang]);

    const t = (key) => translations[lang][key] || key;

    return (
        <LanguageContext.Provider value={{ lang, setLang, t, isRTL }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
