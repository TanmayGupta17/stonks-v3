import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";

// Enhanced lesson content interface with glossary and examples
interface LessonSlide {
  id: number;
  title: string;
  introduction: string;
  keyPoints: {
    title: string;
    description: string;
  }[];
  example?: {
    title: string;
    description: string;
    values?: {
      label: string;
      value: string;
      isGood?: boolean;
    }[];
  };
  terminology?: {
    term: string;
    definition: string;
    example?: string;
  }[];
  actionTip?: string;
  icon: string;
}

export default function EnhancedStockSelectionGuideScreen({
  navigation,
}: {
  navigation: any;
}) {
  // Enhanced lesson content with better structure, terminology definitions, and real examples
  const lessonSlides: LessonSlide[] = [
    {
      id: 1,
      title: "The Foundation: Understanding Value",
      introduction:
        "Before you select any stock, you need to understand what makes a company valuable. The market isn't just random numbers - it's actual businesses with real value.",
      keyPoints: [
        {
          title: "Intrinsic Value",
          description:
            "A company's true worth based on its ability to generate cash in the future. This is what smart investors try to calculate.",
        },
        {
          title: "Market Price vs. Value",
          description:
            "The stock market doesn't always price companies correctly. Finding these discrepancies is how you can gain an edge.",
        },
        {
          title: "Long-term Thinking",
          description:
            "Day-to-day stock movements are often noise. Focus on businesses that will be thriving 5-10 years from now.",
        },
      ],
      terminology: [
        {
          term: "Intrinsic Value",
          definition:
            "The calculated value of a company based on its current financials and future earnings potential.",
          example:
            "If a company's stock price is $50 but your analysis shows its intrinsic value is $75, it may be undervalued.",
        },
        {
          term: "Market Efficiency",
          definition:
            "The degree to which stock prices reflect all available information about a company.",
          example:
            "In a perfectly efficient market, no stock would be undervalued or overvalued.",
        },
      ],
      actionTip:
        "When looking at any stock, first ask: 'What makes this business valuable, and will that value grow over time?'",
      icon: "balance-scale",
    },
    {
      id: 2,
      title: "Profitability: The Lifeblood of Business",
      introduction:
        "A company that can't make money consistently is unlikely to be a good long-term investment. Profitability metrics tell you how efficiently a company turns revenue into actual profits.",
      keyPoints: [
        {
          title: "Profit Margins",
          description:
            "Higher margins mean more profit from each sale. Compare with industry averages - companies with consistently higher margins often have competitive advantages.",
        },
        {
          title: "Return on Equity (ROE)",
          description:
            "Measures how efficiently a company uses shareholder investments. Higher ROE (>15%) often indicates a quality business.",
        },
        {
          title: "Consistent Earnings",
          description:
            "Look for steadily increasing earnings over years, not just quarters. Wild fluctuations can be a red flag.",
        },
      ],
      terminology: [
        {
          term: "Net Profit Margin",
          definition:
            "Net income divided by revenue, expressed as a percentage.",
          example:
            "A company with $100M in revenue and $20M in net income has a 20% profit margin.",
        },
        {
          term: "Return on Equity (ROE)",
          definition:
            "Net income divided by shareholders' equity, measuring how efficiently a company uses investor capital.",
          example:
            "A company generating $15M on $100M of equity has a 15% ROE.",
        },
        {
          term: "Earnings Per Share (EPS)",
          definition: "Net income divided by the number of outstanding shares.",
          example:
            "If a company earns $100M with 50M shares outstanding, its EPS is $2.",
        },
      ],
      example: {
        title: "Tech Giants: Profitability Comparison",
        description:
          "Let's compare the profit margins of two major tech companies:",
        values: [
          { label: "Company A", value: "Net Profit Margin: 25%", isGood: true },
          { label: "Company B", value: "Net Profit Margin: 8%", isGood: false },
          { label: "Industry Average", value: "Net Profit Margin: 15%" },
        ],
      },
      actionTip:
        "Check if profit margins have been stable or improving over the past 5 years. Declining margins often signal trouble ahead.",
      icon: "chart-line",
    },
    {
      id: 3,
      title: "Valuation: Avoiding Overpaying",
      introduction:
        "Even the best company can be a bad investment if you pay too much for it. Valuation metrics help you determine if a stock's price is reasonable compared to its fundamentals.",
      keyPoints: [
        {
          title: "P/E Ratio (Price-to-Earnings)",
          description:
            "Compares stock price to earnings per share. Lower is generally better, but must be compared to industry standards and growth rates.",
        },
        {
          title: "PEG Ratio (P/E to Growth)",
          description:
            "P/E divided by expected earnings growth rate. Values under 1.0 may indicate an undervalued stock relative to its growth.",
        },
        {
          title: "Price-to-Book (P/B)",
          description:
            "Compares market value to book value (assets minus liabilities). Useful for comparing financial companies or asset-heavy businesses.",
        },
      ],
      terminology: [
        {
          term: "P/E Ratio",
          definition:
            "Stock price divided by earnings per share, showing how much investors are willing to pay for each dollar of earnings.",
          example: "A stock price of $50 with EPS of $2 has a P/E ratio of 25.",
        },
        {
          term: "PEG Ratio",
          definition:
            "P/E ratio divided by annual EPS growth rate, helping to assess if a high P/E is justified by growth.",
          example:
            "A company with P/E of 30 and 30% annual growth has a PEG of 1.0.",
        },
        {
          term: "Price-to-Book (P/B)",
          definition: "Market price per share divided by book value per share.",
          example:
            "A bank trading at $30 per share with a book value of $20 per share has a P/B of 1.5.",
        },
      ],
      example: {
        title: "Value Trap vs. Growth Opportunity",
        description:
          "Let's compare two stocks with different valuation profiles:",
        values: [
          {
            label: "Value Stock",
            value: "P/E: 8, Growth: 3%, PEG: 2.6",
            isGood: false,
          },
          {
            label: "Growth Stock",
            value: "P/E: 20, Growth: 25%, PEG: 0.8",
            isGood: true,
          },
          { label: "Market Average", value: "P/E: 18, Growth: 8%, PEG: 2.2" },
        ],
      },
      actionTip:
        "Always consider valuation in context with growth rates. A high P/E with high growth can be better than a low P/E with no growth.",
      icon: "calculator",
    },
    {
      id: 4,
      title: "Financial Health: Stability Matters",
      introduction:
        "A company drowning in debt or burning through cash is a risky investment. Financial health metrics help you assess if a company can survive tough times and fund future growth.",
      keyPoints: [
        {
          title: "Debt-to-Equity Ratio",
          description:
            "Measures financial leverage. Lower is generally safer, but some industries naturally operate with more debt (utilities, real estate).",
        },
        {
          title: "Free Cash Flow",
          description:
            "Cash generated after capital expenditures. Positive and growing free cash flow is a strong indicator of financial health.",
        },
        {
          title: "Current Ratio",
          description:
            "Current assets divided by current liabilities. Values above 1.5 suggest the company can easily meet short-term obligations.",
        },
      ],
      terminology: [
        {
          term: "Debt-to-Equity Ratio",
          definition:
            "Total liabilities divided by shareholders' equity, measuring financial leverage.",
          example:
            "A company with $50M in debt and $100M in equity has a debt-to-equity ratio of 0.5.",
        },
        {
          term: "Free Cash Flow (FCF)",
          definition:
            "Operating cash flow minus capital expenditures, showing cash available after maintaining/expanding business operations.",
          example:
            "A company with $100M in operating cash flow and $40M in capital expenditures has FCF of $60M.",
        },
        {
          term: "Current Ratio",
          definition:
            "Current assets divided by current liabilities, measuring ability to pay short-term obligations.",
          example:
            "A company with $150M in current assets and $100M in current liabilities has a current ratio of 1.5.",
        },
      ],
      example: {
        title: "Cash Flow Analysis",
        description: "Two companies with different cash flow situations:",
        values: [
          {
            label: "Startup Tech Co",
            value: "FCF: -$50M, Burning cash for growth",
            isGood: false,
          },
          {
            label: "Established Retailer",
            value: "FCF: +$300M, Growing 5% yearly",
            isGood: true,
          },
          {
            label: "Risk Assessment",
            value: "One requires constant funding, one self-finances growth",
          },
        ],
      },
      actionTip:
        "In uncertain economic times, prioritize companies with low debt and strong cash generation.",
      icon: "shield-alt",
    },
    {
      id: 5,
      title: "Competitive Advantage: The Moat",
      introduction:
        "Companies with sustainable advantages over competitors can maintain profitability for decades. Warren Buffett calls this an 'economic moat' - defenses that protect a business castle.",
      keyPoints: [
        {
          title: "Brand Power",
          description:
            "Strong brands command premium prices and customer loyalty. Think Apple, Nike, or Coca-Cola.",
        },
        {
          title: "Network Effects",
          description:
            "Services that become more valuable as more people use them. Examples include Visa, Facebook, or Amazon Marketplace.",
        },
        {
          title: "Cost Advantages",
          description:
            "Companies that can produce goods or services at lower costs than competitors maintain pricing power.",
        },
      ],
      terminology: [
        {
          term: "Economic Moat",
          definition:
            "A sustainable competitive advantage that protects a company from competitors.",
          example:
            "Apple's ecosystem of hardware, software, and services creates a powerful moat.",
        },
        {
          term: "Network Effects",
          definition:
            "When a product or service becomes more valuable as more people use it.",
          example:
            "Each new user on LinkedIn makes the platform more valuable for all existing users.",
        },
        {
          term: "Switching Costs",
          definition:
            "The barriers (financial, time, effort) that prevent customers from changing to a competitor.",
          example:
            "Enterprise software with deep integration into business processes creates high switching costs.",
        },
      ],
      example: {
        title: "Moat Analysis: Technology",
        description: "Examining competitive advantages in tech:",
        values: [
          {
            label: "Company A",
            value: "Proprietary technology with 40 patents",
            isGood: true,
          },
          {
            label: "Company B",
            value: "Me-too product, easily replicated",
            isGood: false,
          },
          {
            label: "Market Impact",
            value: "A commands premium pricing, B competes on price alone",
          },
        ],
      },
      actionTip:
        "Ask: 'What prevents a competitor from simply copying this business model and undercutting on price?'",
      icon: "trophy",
    },
    {
      id: 6,
      title: "Growth Runway: Room to Expand",
      introduction:
        "A great business with no room to grow has limited investment potential. Understanding a company's total addressable market (TAM) and growth opportunities is essential.",
      keyPoints: [
        {
          title: "Market Size & Penetration",
          description:
            "How much of its potential market has the company already captured? Lower penetration means more growth runway.",
        },
        {
          title: "New Markets & Products",
          description:
            "Can the company expand into related markets or create new product categories? This extends the growth timeline.",
        },
        {
          title: "International Expansion",
          description:
            "Companies successful in one region often have opportunities to replicate that success globally.",
        },
      ],
      terminology: [
        {
          term: "Total Addressable Market (TAM)",
          definition:
            "The total market demand for a product or service, measured in revenue or units.",
          example:
            "The global smartphone TAM is approximately 1.5 billion units annually.",
        },
        {
          term: "Market Penetration",
          definition:
            "The percentage of a target market that a company has captured.",
          example:
            "If a company sells to 20M customers in a market of 100M potential customers, it has 20% penetration.",
        },
        {
          term: "Secular Growth Trend",
          definition:
            "A long-term shift in industry, society, or technology that drives sustained growth.",
          example:
            "Cloud computing is a secular growth trend benefiting companies like Microsoft and Amazon.",
        },
      ],
      example: {
        title: "Growth Comparison: E-commerce",
        description: "Analyzing growth potential in online retail:",
        values: [
          {
            label: "Company A",
            value:
              "80% market share in home country, minimal international presence",
            isGood: false,
          },
          {
            label: "Company B",
            value: "20% market share, operating in 5 of 50 potential countries",
            isGood: true,
          },
          {
            label: "Growth Ceiling",
            value:
              "A is near saturation, B has significant expansion potential",
          },
        ],
      },
      actionTip:
        "The best investments are often companies that can reinvest profits into new growth opportunities at high returns.",
      icon: "rocket",
    },
    {
      id: 7,
      title: "Management Quality: Leadership Matters",
      introduction:
        "Even great businesses can be destroyed by poor management. Conversely, exceptional leaders can transform average businesses into outstanding ones.",
      keyPoints: [
        {
          title: "Track Record",
          description:
            "Has management delivered on past promises? Look for consistency between stated goals and actual results.",
        },
        {
          title: "Capital Allocation",
          description:
            "How do they deploy cash? The best managers know when to reinvest, when to acquire, and when to return cash to shareholders.",
        },
        {
          title: "Insider Ownership",
          description:
            "Management with significant personal investment in the company aligns their interests with shareholders.",
        },
      ],
      terminology: [
        {
          term: "Capital Allocation",
          definition:
            "How management deploys available capital among competing uses (reinvestment, acquisitions, dividends, buybacks).",
          example:
            "Apple allocates capital to R&D, strategic acquisitions, dividends, and significant share buybacks.",
        },
        {
          term: "Insider Ownership",
          definition:
            "The percentage of company shares owned by executives and directors.",
          example:
            "A CEO who owns 10% of a company's stock has significant personal interest in its success.",
        },
        {
          term: "ROIC (Return on Invested Capital)",
          definition:
            "A measure of how efficiently management generates returns from the capital they invest in the business.",
          example:
            "A company earning $20M on $100M of invested capital has a 20% ROIC.",
        },
      ],
      example: {
        title: "Leadership Analysis",
        description: "Contrasting management approaches:",
        values: [
          {
            label: "CEO A",
            value: "Founder with 15% ownership, focused on 10-year vision",
            isGood: true,
          },
          {
            label: "CEO B",
            value:
              "Professional manager with 0.1% ownership, focuses on quarterly results",
            isGood: false,
          },
          {
            label: "Impact",
            value:
              "A makes strategic investments for long-term growth, B optimizes for short-term metrics",
          },
        ],
      },
      actionTip:
        "Listen to earnings calls and read shareholder letters. Do managers speak candidly about challenges, or only highlight positives?",
      icon: "user-tie",
    },
    {
      id: 8,
      title: "Stock Selection Framework: Practical Guide",
      introduction:
        "Great investors develop a systematic approach to evaluating stocks. Here's a practical framework that combines all the elements we've covered into an actionable stock selection process.",
      keyPoints: [
        {
          title: "Step 1: Business Quality Assessment",
          description:
            "Evaluate profitability metrics, competitive advantages, and management quality first. Quality is non-negotiable.",
        },
        {
          title: "Step 2: Financial Health Check",
          description:
            "Analyze balance sheet strength, cash flow generation, and debt levels to ensure stability and sustainability.",
        },
        {
          title: "Step 3: Growth Potential Evaluation",
          description:
            "Assess market opportunities, innovation pipeline, and expansion potential to determine future prospects.",
        },
      ],
      terminology: [
        {
          term: "Margin of Safety",
          definition:
            "Investing only when a stock trades significantly below your calculated intrinsic value, providing a buffer against errors in your analysis.",
          example:
            "If you calculate a stock's intrinsic value at $100, buying at $70 gives a 30% margin of safety.",
        },
        {
          term: "Quality-at-a-Reasonable-Price (QARP)",
          definition:
            "An investment approach focusing on high-quality companies at fair (not necessarily cheap) valuations.",
          example:
            "Paying a P/E of 25 for a company with 20% growth, strong moat, and excellent management could be considered QARP.",
        },
        {
          term: "Circle of Competence",
          definition:
            "The area of expertise where an investor has knowledge and experience to make informed judgments.",
          example:
            "A software engineer might have a circle of competence in evaluating technology companies.",
        },
      ],
      example: {
        title: "Stock Selection Decision Matrix",
        description: "A practical decision framework:",
        values: [
          {
            label: "Strong Buy",
            value: "Quality 8-10, Financial Health 8-10, Fair Valuation",
            isGood: true,
          },
          {
            label: "Consider",
            value: "Quality 7+, Financial Health 6+, Attractive Valuation",
          },
          {
            label: "Avoid",
            value: "Quality <6, Financial Health <5, Any Valuation",
            isGood: false,
          },
        ],
      },
      actionTip:
        "Start with quality first, then financial health, and only then consider valuation. Never compromise on business quality for a seemingly cheap price.",
      icon: "check-double",
    },
  ];

  // Screen width for animations
  const screenWidth = Dimensions.get("window").width;

  // State variables
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<ScrollView>(null);

  // Calculate progress percentage
  const progress = ((currentSlideIndex + 1) / lessonSlides.length) * 100;

  // Handle next slide
  const goToNextSlide = () => {
    if (currentSlideIndex < lessonSlides.length - 1) {
      flatListRef.current?.scrollTo({
        x: screenWidth * (currentSlideIndex + 1),
        animated: true,
      });
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      // Complete lesson
      navigation.navigate("LessonComplete", { lessonName: "Stock Selection" });
    }
  };

  // Handle previous slide
  const goToPrevSlide = () => {
    if (currentSlideIndex > 0) {
      flatListRef.current?.scrollTo({
        x: screenWidth * (currentSlideIndex - 1),
        animated: true,
      });
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  // Handle scroll end
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / screenWidth);
    setCurrentSlideIndex(newIndex);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0a2e38", "#000000"]} style={styles.background}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-left" size={22} color="#a3c2cd" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Stock Selection Masterclass</Text>

          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Lesson Content */}
        <Animated.ScrollView
          ref={flatListRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          style={styles.slidesContainer}
        >
          {lessonSlides.map((slide) => (
            <View
              key={slide.id}
              style={[styles.slide, { width: screenWidth - 40 }]}
            >
              <ScrollView style={styles.contentScrollView}>
                <View style={styles.slideHeader}>
                  <View style={styles.iconContainer}>
                    <FontAwesome5 name={slide.icon} size={28} color="#fff" />
                  </View>
                  <Text style={styles.slideNumber}>
                    {slide.id} of {lessonSlides.length}
                  </Text>
                </View>

                <Text style={styles.slideTitle}>{slide.title}</Text>

                <Text style={styles.introText}>{slide.introduction}</Text>

                {/* Key Points */}
                <View style={styles.keyPointsContainer}>
                  {slide.keyPoints.map((point, index) => (
                    <View key={index} style={styles.keyPoint}>
                      <View style={styles.keyPointHeader}>
                        <View style={styles.keyPointBullet}>
                          <Text style={styles.bulletText}>{index + 1}</Text>
                        </View>
                        <Text style={styles.keyPointTitle}>{point.title}</Text>
                      </View>
                      <Text style={styles.keyPointDesc}>
                        {point.description}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Terminology Section - New Addition */}
                {slide.terminology && (
                  <View style={styles.terminologyContainer}>
                    <Text style={styles.sectionTitle}>Key Terminology</Text>
                    {slide.terminology.map((term, index) => (
                      <View key={index} style={styles.termItem}>
                        <Text style={styles.termName}>{term.term}</Text>
                        <Text style={styles.termDefinition}>
                          {term.definition}
                        </Text>
                        {term.example && (
                          <View style={styles.termExampleContainer}>
                            <Text style={styles.termExampleLabel}>
                              Example:
                            </Text>
                            <Text style={styles.termExample}>
                              {term.example}
                            </Text>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                )}

                {/* Example Section */}
                {slide.example && (
                  <View style={styles.exampleContainer}>
                    <Text style={styles.exampleTitle}>
                      {slide.example.title}
                    </Text>
                    <Text style={styles.exampleDesc}>
                      {slide.example.description}
                    </Text>

                    {slide.example.values && (
                      <View style={styles.valuesContainer}>
                        {slide.example.values.map((valueItem, index) => (
                          <View key={index} style={styles.valueItem}>
                            <View style={styles.valueLabelContainer}>
                              <Text style={styles.valueLabel}>
                                {valueItem.label}
                              </Text>
                            </View>
                            <View style={styles.valueTextContainer}>
                              <Text
                                style={[
                                  styles.valueText,
                                  valueItem.isGood === true
                                    ? styles.goodValue
                                    : valueItem.isGood === false
                                    ? styles.badValue
                                    : styles.neutralValue,
                                ]}
                              >
                                {valueItem.value}
                              </Text>
                              {valueItem.isGood === true && (
                                <FontAwesome5
                                  name="check-circle"
                                  size={16}
                                  color="#58cc02"
                                  style={styles.valueIcon}
                                />
                              )}
                              {valueItem.isGood === false && (
                                <FontAwesome5
                                  name="times-circle"
                                  size={16}
                                  color="#ff4040"
                                  style={styles.valueIcon}
                                />
                              )}
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}

                {/* Action Tip */}
                {slide.actionTip && (
                  <View style={styles.tipContainer}>
                    <FontAwesome5
                      name="lightbulb"
                      size={20}
                      color="#ffcc00"
                      style={styles.tipIcon}
                    />
                    <Text style={styles.tipText}>{slide.actionTip}</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          ))}
        </Animated.ScrollView>

        {/* Navigation Dots */}
        <View style={styles.dotsContainer}>
          {lessonSlides.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dot,
                index === currentSlideIndex && styles.activeDot,
              ]}
              onPress={() => {
                flatListRef.current?.scrollTo({
                  x: screenWidth * index,
                  animated: true,
                });
                setCurrentSlideIndex(index);
              }}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonsContainer}>
          {currentSlideIndex > 0 ? (
            <TouchableOpacity style={styles.navButton} onPress={goToPrevSlide}>
              <FontAwesome5
                name="arrow-left"
                size={18}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flex: 1 }} />
          )}

          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: "#58cc02" }]}
            onPress={goToNextSlide}
          >
            <Text style={styles.buttonText}>
              {currentSlideIndex === lessonSlides.length - 1
                ? "Complete"
                : "Next"}
            </Text>
            <FontAwesome5
              name={
                currentSlideIndex === lessonSlides.length - 1
                  ? "check"
                  : "arrow-right"
              }
              size={18}
              color="#fff"
              style={[styles.buttonIcon, { marginLeft: 10, marginRight: 0 }]}
            />
          </TouchableOpacity>
        </View>

        {/* Practice Button */}
        {/* <TouchableOpacity
          style={styles.practiceButton}
          onPress={() => navigation.navigate("StockQuiz")}
        >
          <FontAwesome5
            name="graduation-cap"
            size={18}
            color="#fff"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Practice These Concepts</Text>
        </TouchableOpacity> */}

        {/* Reference Guide Button - New Addition */}
        {/* <TouchableOpacity
          style={styles.referenceButton}
          onPress={() => navigation.navigate("StockTerminologyGuide")}
        >
          <FontAwesome5
            name="book"
            size={18}
            color="#fff"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Terminology Reference Guide</Text>
        </TouchableOpacity> */}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#58cc02",
    marginLeft: 15,
  },
  progressContainer: {
    flex: 1,
    height: 4,
    backgroundColor: "#1a3540",
    borderRadius: 2,
    marginLeft: 15,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#58cc02",
    borderRadius: 2,
  },
  slidesContainer: {
    flex: 1,
  },
  slide: {
    backgroundColor: "#1a3540",
    borderRadius: 16,
    padding: 20,
    marginRight: 20,
  },
  slideHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2c6b7b",
    justifyContent: "center",
    alignItems: "center",
  },
  slideNumber: {
    fontSize: 14,
    color: "#a3c2cd",
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 15,
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#a3c2cd",
    marginBottom: 20,
  },
  contentScrollView: {
    maxHeight: 460,
  },
  keyPointsContainer: {
    marginBottom: 20,
  },
  keyPoint: {
    marginBottom: 15,
  },
  keyPointHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  keyPointBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#58cc02",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  bulletText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
  keyPointTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  keyPointDesc: {
    fontSize: 15,
    lineHeight: 22,
    color: "#a3c2cd",
    paddingLeft: 34,
  },
  // Terminology section styles - New Addition
  terminologyContainer: {
    backgroundColor: "#0c1e24",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 15,
  },
  termItem: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#1a3540",
  },
  termName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#58cc02",
    marginBottom: 5,
  },
  termDefinition: {
    fontSize: 15,
    color: "#a3c2cd",
    marginBottom: 8,
    lineHeight: 22,
  },
  termExampleContainer: {
    backgroundColor: "#243842",
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
  },
  termExampleLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 3,
  },
  termExample: {
    fontSize: 14,
    color: "#a3c2cd",
    fontStyle: "italic",
  },
  exampleContainer: {
    backgroundColor: "#0c1e24",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  exampleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  exampleDesc: {
    fontSize: 15,
    color: "#a3c2cd",
    marginBottom: 15,
  },
  valuesContainer: {
    marginTop: 10,
  },
  valueItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#1a3540",
    borderRadius: 8,
    overflow: "hidden",
  },
  valueLabelContainer: {
    backgroundColor: "#2c6b7b",
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: "40%",
  },
  valueLabel: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
  valueTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 15,
  },
  valueText: {
    fontSize: 14,
    flex: 1,
  },
  goodValue: {
    color: "#58cc02",
  },
  badValue: {
    color: "#ff4040",
  },
  neutralValue: {
    color: "#a3c2cd",
  },
  valueIcon: {
    marginLeft: 8,
  },
  tipContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e2a30",
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#ffcc00",
  },
  tipIcon: {
    marginRight: 12,
  },
  tipText: {
    fontSize: 15,
    fontStyle: "italic",
    color: "#d8e2e6",
    flex: 1,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1a3540",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#58cc02",
    width: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2c6b7b",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  practiceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2389da",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  // Reference guide button - New Addition
  referenceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8654de",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
});
