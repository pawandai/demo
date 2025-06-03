/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Globe, ChevronDown, AlertCircle } from "lucide-react"
import { useQuery } from "react-query"
import { termsApi } from "../services/apiClient"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"

const Terms = () => {
  const { language: urlLanguage } = useParams()
  const [selectedLanguage, setSelectedLanguage] = useState(urlLanguage || "sv")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const languages = [
    { code: "sv", name: "Svenska", flag: "🇸🇪" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ]

  const {
    data: terms,
    isLoading,
    error,
    refetch,
  } = useQuery(["terms", selectedLanguage], () => termsApi.getByLanguage(selectedLanguage), {
    enabled: !!selectedLanguage,
    select: (response) => response.data,
    retry: 1,
  })

  useEffect(() => {
    if (urlLanguage && urlLanguage !== selectedLanguage) {
      setSelectedLanguage(urlLanguage)
    }
  }, [selectedLanguage, urlLanguage])

  const handleLanguageChange = (languageCode) => {
    setSelectedLanguage(languageCode)
    setIsDropdownOpen(false)
    window.history.pushState(null, "", `/terms/${languageCode}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error && error.response?.status !== 404) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message="Failed to load terms" onRetry={() => refetch()} />
      </div>
    )
  }

  const selectedLang = languages.find((lang) => lang.code === selectedLanguage)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gradient-surface"
    >
      {/* Hero Section */}
      <div className="bg-gradient-primary text-white">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Terms & Conditions</h1>
            <p className="text-xl md:text-2xl opacity-75 max-w-3xl mx-auto">
              Please read our terms and conditions carefully before using our services
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Language Selector */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 px-4 py-3 bg-surface border rounded-lg hover:bg-surface-dark transition-colors"
              >
                <Globe className="w-5 h-5 text-primary" />
                <span className="text-lg">{selectedLang?.flag}</span>
                <span className="font-medium">{selectedLang?.name}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 mt-2 bg-surface border rounded-lg shadow-lg z-10 min-w-full"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-dark transition-colors rounded-lg ${
                        selectedLanguage === lang.code ? "bg-primary text-white" : ""
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Terms Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            {!terms && error?.response?.status === 404 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-warning mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-text mb-2">Terms Not Available</h3>
                <p className="text-text-secondary mb-4">
                  Terms and conditions for {selectedLang?.name} are not available yet.
                </p>
                <button onClick={() => refetch()} className="btn btn-primary">
                  Try Again
                </button>
              </div>
            ) : (
              <div className="prose max-w-none">
                {terms?.content ? (
                  <div dangerouslySetInnerHTML={{ __html: terms.content }} />
                ) : (
                  <div>
                    <h2>Terms and Conditions</h2>
                    <p>
                      <strong>GENOM ATT</strong> klicka på Fakturera Nu så väljer ni att registrera enligt den
                      information som ni har lagt in och texten på registrerings sidan och villkoren här, och accepterar
                      samtidigt villkoren här.
                    </p>
                    <p>Ni kan använda programmet GRATIS i 14 dagar.</p>
                    <p>
                      123 Fakturera är så lätt och självförklarande att chansen för att du kommer behöva support är
                      minimal, men om du skulle behöva support, så är vi här för dig, med vårt kontor bemannat större
                      delen av dygnet. Efter provperioden kostar programmet 99 kr per månad.
                    </p>

                    <h3>Användningsvillkor</h3>
                    <p>Genom att använda våra tjänster accepterar du följande villkor:</p>
                    <ul>
                      <li>Du får endast använda tjänsten för lagliga ändamål</li>
                      <li>Du ansvarar för att hålla dina inloggningsuppgifter säkra</li>
                      <li>Vi förbehåller oss rätten att avsluta konton som bryter mot våra villkor</li>
                      <li>All data som lagras i systemet är din egendom</li>
                    </ul>

                    <h3>Betalningsvillkor</h3>
                    <p>
                      Efter den kostnadsfria provperioden på 14 dagar debiteras 99 kr per månad. Betalning sker
                      automatiskt via registrerat betalkort.
                    </p>

                    <h3>Uppsägning</h3>
                    <p>
                      Du kan när som helst säga upp din prenumeration genom att kontakta vår kundtjänst eller via ditt
                      konto.
                    </p>

                    <h3>Integritet</h3>
                    <p>
                      Vi värnar om din integritet och behandlar dina personuppgifter enligt gällande
                      dataskyddsförordning (GDPR).
                    </p>

                    <h3>Kontakt</h3>
                    <p>Vid frågor om dessa villkor, kontakta oss på support@123fakturera.se</p>
                  </div>
                )}
              </div>
            )}

            {/* Last Updated */}
            {terms?.updatedAt && (
              <div className="mt-8 pt-6 border-t">
                <p className="text-sm text-text-secondary">
                  Last updated:{" "}
                  {new Date(terms.updatedAt).toLocaleDateString(selectedLanguage === "sv" ? "sv-SE" : "en-US")}
                  {terms.version && ` • Version ${terms.version}`}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Terms
