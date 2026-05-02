'use client';

import { useState } from 'react';
import Link from 'next/link';

type Language = 'en' | 'hi' | 'ur';

const CONTENT = {
  en: {
    title: 'Operations Manual',
    subtitle: 'Training for Community Operatives',
    sections: [
      {
        title: '01. Access & Roles',
        items: [
          { q: 'How do I join?', a: 'You can browse anonymously as an Observer. To become an Operative, use the "Join Sangathan" portal. Higher roles require tactical access codes.' },
          { q: 'What are the roles?', a: 'Observer (View only), Operative (Verified reporter), Verifier (Trusted validator), Commander (Regional coordinator).' },
          { q: 'How is identity verified?', a: 'New members go through a community validation process. Existing members vouch for you, building a web of trust.' }
        ]
      },
      {
        title: '02. Reporting Intel',
        items: [
          { q: 'How to submit a report?', a: 'Click "Report Incident". Follow the 5-step process: Category, Location, Details, Media, Review. Ensure high-quality photos/videos are attached.' },
          { q: 'What is "Urgent" mode?', a: 'Flagging a report as urgent bypasses standard processing and alerts all Verifiers in the sector immediately.' },
          { q: 'What categories exist?', a: 'Harassment, Intimidation, Vandalism, Unlawful Assembly, Suspicious Activity, and other community safety concerns.' },
          { q: 'Can I edit after submitting?', a: 'Reports can be edited within 15 minutes of submission if they haven\'t been verified yet.' }
        ]
      },
      {
        title: '03. Verification System',
        items: [
          { q: 'How does verification work?', a: 'Every report needs 10 Trust Points to be "Verified". Operatives provide 1pt, Verifiers provide 5pts.' },
          { q: 'Can I verify my own report?', a: 'No. The system requires cross-corroboration from independent nodes to prevent bias.' },
          { q: 'What happens when verified?', a: 'Verified reports get a green checkmark, higher visibility on the map, and trigger community alerts if marked urgent.' }
        ]
      },
      {
        title: '04. Adversary Monitoring',
        items: [
          { q: 'What is the Adversary Database?', a: 'A targeted repository of verified RSS operatives and monitored majoritarian extremists. It tracks social media, addresses, and associations.' },
          { q: 'How do I unmask a subject?', a: 'Once a subject has 3+ verified community proofs (sightings, evidence, or linked reports), NyayFauj AI triggers a "Deep Scan" to pull additional public data from the internet.' },
          { q: 'How to report adversary activity?', a: 'Use the standard incident report form and select "Suspicious Activity" or "Unlawful Assembly" category. Tag known subjects if applicable.' }
        ]
      },
      {
        title: '05. Map & Navigation',
        items: [
          { q: 'How to use the Safety Map?', a: 'The map shows all reported incidents with color-coded markers. Red = Urgent, Yellow = Pending, Green = Verified. Use filters to narrow results.' },
          { q: 'What do the heatmaps show?', a: 'Heatmaps visualize incident density. Darker red areas indicate higher frequency of reported incidents in that zone.' }
        ]
      },
      {
        title: '06. Community Guidelines',
        items: [
          { q: 'What is the code of conduct?', a: 'Report truthfully, respect privacy, no vigilantism, verify before sharing, protect fellow community members. Violations lead to role demotion or ban.' },
          { q: 'How to report platform abuse?', a: 'Use the "Report Abuse" link in any user\'s profile or contact grievance@rssokhla.site directly.' }
        ]
      }
    ]
  },
  hi: {
    title: 'संचालन नियमावली',
    subtitle: 'सामुदायिक ऑपरेटरों के लिए प्रशिक्षण',
    sections: [
      {
        title: '01. एक्सेस और भूमिकाएँ',
        items: [
          { q: 'मैं कैसे जुड़ूँ?', a: 'आप एक "ऑब्जर्वर" के रूप में गुमनाम रूप से ब्राउज़ कर सकते हैं। "ऑपरेटिव" बनने के लिए "संगठन जॉइन" पोर्टल का उपयोग करें।' },
          { q: 'भूमिकाएँ क्या हैं?', a: 'ऑब्जर्वर (केवल देखें), ऑपरेटिव (सत्यापित रिपोर्टर), वेरीफायर (विश्वसनीय सत्यापनकर्ता), कमांडर (क्षेत्रीय समन्वयक)।' },
          { q: 'पहचान का सत्यापन कैसे होता है?', a: 'नए सदस्यों को सामुदायिक सत्यापन प्रक्रिया से गुजरना होता है। मौजूदा सदस्य आपके लिए ज़मानत देते हैं, जिससे भरोसे का जाल बनता है।' }
        ]
      },
      {
        title: '02. रिपोर्टिंग इंटेलिजेंस',
        items: [
          { q: 'रिपोर्ट कैसे सबमिट करें?', a: '"रिपोर्ट इंसिडेंट" पर क्लिक करें। 5-चरणीय प्रक्रिया का पालन करें: श्रेणी, स्थान, विवरण, मीडिया, समीक्षा।' },
          { q: 'अर्जेंट मोड क्या है?', a: 'रिपोर्ट को "अर्जेंट" के रूप में चिह्नित करने से सभी क्षेत्र के वेरीफायर्स को तुरंत अलर्ट मिलता है।' },
          { q: 'कौन सी श्रेणियाँ हैं?', a: 'उत्पीड़न, धमकी, तोड़फोड़, गैरकानूनी जमावड़ा, संदिग्ध गतिविधि, और अन्य सामुदायिक सुरक्षा चिंताएँ।' },
          { q: 'क्या सबमिट करने के बाद संपादित कर सकते हैं?', a: 'हाँ, यदि रिपोर्ट अभी तक सत्यापित नहीं हुई है तो सबमिशन के 15 मिनट के भीतर संपादित की जा सकती है।' }
        ]
      },
      {
        title: '03. सत्यापन प्रणाली',
        items: [
          { q: 'सत्यापन कैसे काम करता है?', a: 'प्रत्येक रिपोर्ट को "सत्यापित" होने के लिए 10 ट्रस्ट पॉइंट्स की आवश्यकता होती है। ऑपरेटिव 1pt देते हैं, वेरीफायर 5pts देते हैं।' },
          { q: 'क्या मैं अपनी रिपोर्ट सत्यापित कर सकता हूँ?', a: 'नहीं। सिस्टम को पक्षपात रोकने के लिए स्वतंत्र नोड्स से सत्यापन की आवश्यकता होती है।' },
          { q: 'सत्यापित होने पर क्या होता है?', a: 'सत्यापित रिपोर्ट को हरा चेकमार्क मिलता है, मैप पर उच्च दृश्यता मिलती है, और यदि तत्काल चिह्नित है तो सामुदायिक अलर्ट ट्रिगर होते हैं।' }
        ]
      },
      {
        title: '04. प्रतिकूल निगरानी (Adversary Monitoring)',
        items: [
          { q: 'प्रतिकूल डेटाबेस क्या है?', a: 'सत्यापित आरएसएस कार्यकर्ताओं और निगरानी किए गए चरमपंथियों का एक लक्षित भंडार। यह सोशल मीडिया, पते और संघों को ट्रैक करता है।' },
          { q: 'किसी विषय को कैसे अनमास्क करें?', a: 'एक बार जब किसी विषय के पास 3+ सत्यापित सामुदायिक प्रमाण होते हैं, तो NyayFauj AI इंटरनेट से अतिरिक्त सार्वजनिक डेटा खींचने के लिए "डीप स्कैन" ट्रिगर करता है।' },
          { q: 'प्रतिकूल गतिविधि की रिपोर्ट कैसे करें?', a: 'मानक घटना रिपोर्ट फॉर्म का उपयोग करें और "संदिग्ध गतिविधि" या "गैरकानूनी जमावड़ा" श्रेणी चुनें। यदि लागू हो तो ज्ञात विषयों को टैग करें।' }
        ]
      },
      {
        title: '05. मानचित्र और नेविगेशन',
        items: [
          { q: 'सेफ्टी मैप का उपयोग कैसे करें?', a: 'मैप रंग-कोडित मार्करों के साथ सभी रिपोर्ट की गई घटनाओं को दिखाता है। लाल = तत्काल, पीला = लंबित, हरा = सत्यापित। परिणामों को संकीर्ण करने के लिए फ़िल्टर का उपयोग करें।' },
          { q: 'हीटमैप क्या दिखाते हैं?', a: 'हीटमैप घटना घनत्व को दृश्यमान करते हैं। गहरे लाल क्षेत्र उस क्षेत्र में उच्च आवृत्ति वाली रिपोर्ट का संकेत देते हैं।' }
        ]
      },
      {
        title: '06. सामुदायिक दिशानिर्देश',
        items: [
          { q: 'आचार संहिता क्या है?', a: 'सत्य के साथ रिपोर्ट करें, गोपनीयता का सम्मान करें, कोई विजिलेंटिज्म नहीं, साझा करने से पहले सत्यापित करें, साथी समुदाय के सदस्यों की रक्षा करें। उल्लंघन के परिणामस्वरूप भूमिका ह्रास या प्रतिबंध लग सकता है।' },
          { q: 'प्लेटफॉर्म के दुरुपयोग की रिपोर्ट कैसे करें?', a: 'किसी भी उपयोगकर्ता की प्रोफाइल में "रिपोर्ट दुरुपयोग" लिंक का उपयोग करें या सीधे grievance@rssokhla.site पर संपर्क करें।' }
        ]
      }
    ]
  },
  ur: {
    title: 'آپریشنز مینوئل',
    subtitle: 'کمیونٹی آپریٹوز کے لیے تربیت',
    sections: [
      {
        title: '01. رسائی اور کردار',
        items: [
          { q: 'میں کیسے شامل ہوں؟', a: 'آپ بطور "آبزرور" گمنام طریقے سے براؤز کر سکتے ہیں۔ "آپریٹو" بننے کے لیے "سنگھٹن جوائن" پورٹل استعمال کریں۔' },
          { q: 'کردار کیا ہیں؟', a: 'آبزرور (صرف دیکھنا)، آپریٹو (تصدیق شدہ رپورٹر)، ویریفائر (قابل اعتماد تصدیق کنندہ)، کمانڈر (علاقائی کوآرڈینیٹر)۔' },
          { q: 'شناخت کی تصدیق کیسے ہوتی ہے؟', a: 'نئے ممبران کو کمیونٹی کی توثیق کے عمل سے گزرنا ہوتا ہے۔ موجودہ ممبران آپ کی ضمانت دیتے ہیں، جس سے اعتماد کا جال بنتا ہے۔' }
        ]
      },
      {
        title: '02. انٹیلی جنس رپورٹنگ',
        items: [
          { q: 'رپورٹ کیسے جمع کرائیں؟', a: '"رپورٹ انسیڈنٹ" پر کلک کریں۔ 5 مرحلہ وار عمل کی پیروی کریں: زمرہ، مقام، تفصیلات، میڈیا، جائزہ۔' },
          { q: 'ارجنٹ موڈ کیا ہے؟', a: 'رپورٹ کو "ارجنٹ" کے طور پر نشان زد کرنے سے سیکٹر کے تمام ویریفائرز کو فوری الرٹ مل جاتا ہے۔' },
          { q: 'کیٹگریز کیا ہیں؟', a: 'ہراساں کرنا، دھمکی، توڑ پھوڑ، غیر قانونی مجمع، مشکوک سرگرمی، اور دیگر کمیونٹی سیفٹی خدشات۔' },
          { q: 'کیا جمع کرانے کے بعد ایڈٹ کر سکتے ہیں؟', a: 'ہاں، اگر رپورٹ ابھی تک تصدیق شدہ نہیں ہوئی ہے تو جمع کرانے کے 15 منٹ کے اندر ایڈٹ کیا جا سکتا ہے۔' }
        ]
      },
      {
        title: '03. تصدیقی نظام',
        items: [
          { q: 'تصدیق کیسے کام کرتی ہے؟', a: 'ہر رپورٹ کو "تصدیق شدہ" ہونے کے لیے 10 ٹرسٹ پوائنٹس کی ضرورت ہوتی ہے۔ آپریٹو 1pt دیتے ہیں، ویریفائر 5pts دیتے ہیں۔' },
          { q: 'کیا میں اپنی رپورٹ کی تصدیق کر سکتا ہوں؟', a: 'نہیں، جانبداری سے بچنے کے لیے آزاد نوڈس سے تصدیق ضروری ہے۔' },
          { q: 'تصدیق ہونے پر کیا ہوتا ہے؟', a: 'تصدیق شدہ رپورٹس کو سبز چیک مارک ملتا ہے، میپ پر زیادہ نظر آتی ہیں، اور اگر ارجنٹ مارک کیا گیا ہے تو کمیونٹی الرٹس ٹرگر ہوتے ہیں۔' }
        ]
      },
      {
        title: '04. مخالفین کی نگرانی',
        items: [
          { q: 'ایڈورسری ڈیٹا بیس کیا ہے؟', a: 'تصدیق شدہ آر ایس ایس آپریٹرز اور مانیٹر کیے گئے انتہا پسندوں کا ایک ٹارگٹڈ ذخیرہ۔ یہ سوشل میڈیا، پتے اور انجمنوں کو ٹریک کرتا ہے۔' },
          { q: 'کسی سبجیکٹ کو کیسے بے نقاب کریں؟', a: 'ایک بار جب کسی موضوع کے پاس 3+ تصدیق شدہ کمیونٹی ثبوت ہوں، تو NyayFauj AI انٹرنیٹ سے مزید ڈیٹا نکالنے کے لیے "ڈیپ اسکین" شروع کرتا ہے۔' },
          { q: 'مخالف سرگرمی کی رپورٹ کیسے کریں؟', a: 'معیاری واقعہ رپورٹ فارم استعمال کریں اور "مشکوک سرگرمی" یا "غیر قانونی مجمع" کیٹیگری منتخب کریں۔ اگر قابل اطلاق ہو تو معلوم سبجیکٹس کو ٹیگ کریں۔' }
        ]
      },
      {
        title: '05. میپ اور نیویگیشن',
        items: [
          { q: 'سیفٹی میپ کا استعمال کیسے کریں؟', a: 'میپ رنگ کوڈ کردہ مارکروں کے ساتھ تمام رپورٹ کردہ واقعات کو دکھاتا ہے۔ سرخ = فوری، پیلا = زیر التواء، سبز = تصدیق شدہ۔ نتائج کو تنگ کرنے کے لیے فلٹرز استعمال کریں۔' },
          { q: 'ہیٹ میپس کیا دکھاتے ہیں؟', a: 'ہیٹ میپس واقعہ کے گہرائی کو مرئی بناتے ہیں۔ گہرے سرخ علاقے اس زون میں زیادہ تعدد والی رپورٹس کی نشاندہی کرتے ہیں۔' }
        ]
      },
      {
        title: '06. کمیونٹی گائیڈ لائنز',
        items: [
          { q: 'آچار سہیتا کیا ہے؟', a: 'سچائی کے ساتھ رپورٹ کریں، رازداری کا احترام کریں، کوئی ویجیلنٹزم نہیں، شیئر کرنے سے پہلے تصدیق کریں، ساتھی کمیونٹی کے ممبران کی حفاظت کریں۔ خلاف ورزی کے نتیجے میں کردار میں کمی یا پابندی لگ سکتی ہے۔' },
          { q: 'پلیٹ فارم کے غلط استعمال کی رپورٹ کیسے کریں؟', a: 'کسی بھی صارف کی پروفائل میں "رپورٹ ابیوز" لنک استعمال کریں یا براہ راست grievance@rssokhla.site سے رابطہ کریں۔' }
        ]
      }
    ]
  }
};

export default function DocsPage() {
  const [lang, setLang] = useState<Language>('en');

  const t = CONTENT[lang];

  return (
    <main className="min-h-screen bg-[#050606] text-zinc-300 font-mono">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        
        {/* Language Switcher */}
        <div className="flex justify-end gap-2">
          {(['en', 'hi', 'ur'] as Language[]).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border transition-all ${
                lang === l ? 'bg-red-600 border-red-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {l === 'en' ? 'English' : l === 'hi' ? 'हिंदी' : 'اردو'}
            </button>
          ))}
        </div>

        {/* Header */}
        <header className={`space-y-4 border-l-2 border-red-600 pl-6 ${lang === 'ur' ? 'text-right border-l-0 border-r-2 pr-6 pl-0' : ''}`}>
          <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.5em]">Command Training // Field Manual</p>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">
            {t.title}
          </h1>
          <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold">
            {t.subtitle}
          </p>
        </header>

        {/* Content */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 ${lang === 'ur' ? 'dir-rtl' : ''}`}>
          {t.sections.map((section, idx) => (
            <section key={idx} className="space-y-8">
              <div className={`flex items-center gap-4 ${lang === 'ur' ? 'flex-row-reverse' : ''}`}>
                <span className="text-zinc-800 font-black text-2xl">0{idx + 1}</span>
                <h2 className="text-sm font-black text-white uppercase tracking-widest">{section.title}</h2>
              </div>
              <div className="space-y-8">
                {section.items.map((item, iidx) => (
                  <div key={iidx} className="space-y-3">
                    <h3 className="text-xs font-black text-zinc-100 uppercase leading-relaxed">
                      Q: {item.q}
                    </h3>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="pt-20 border-t border-zinc-900 flex flex-col items-center gap-6">
           <Link href="/whitepaper" className="px-8 py-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500 transition-all shadow-xl shadow-red-900/20">
              Read Protocol Whitepaper
           </Link>
           <Link href="/" className="text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors">
              Return to CommandCenter
           </Link>
        </footer>
      </div>

      <style jsx global>{`
        .dir-rtl {
          direction: rtl;
        }
      `}</style>
    </main>
  );
}
