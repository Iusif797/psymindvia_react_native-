import { View, Text, StyleSheet, ScrollView, StatusBar, Platform, Dimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackgroundWrapper from "../../components/BackgroundWrapper";

const { height } = Dimensions.get("window");

const content: Record<string, { 
  title: string; 
  category: string;
  readTime: string;
  text: string;
  sections: { subtitle: string; content: string }[];
}> = {
  "1": { 
    title: "Понимание тревожности", 
    category: "Тревога",
    readTime: "5 мин",
    text: "Тревожность — это естественная реакция организма на стресс. Однако когда она становится чрезмерной, она может значительно влиять на качество жизни.",
    sections: [
      {
        subtitle: "Что такое тревожность?",
        content: "Тревожность представляет собой эмоциональное состояние, характеризующееся чувством беспокойства, напряжения и страха перед будущими событиями. Это защитный механизм, который помогает нам справляться с потенциальными угрозами."
      },
      {
        subtitle: "Признаки тревожности",
        content: "Физические симптомы могут включать учащенное сердцебиение, потливость, дрожь и затрудненное дыхание. Психологические проявления включают постоянное беспокойство, трудности с концентрацией и нарушения сна."
      },
      {
        subtitle: "Как справиться",
        content: "Эффективные методы включают дыхательные упражнения, техники заземления, когнитивно-поведенческую терапию и, при необходимости, медикаментозное лечение под наблюдением специалиста."
      }
    ]
  },
  "2": { 
    title: "Эмоциональная устойчивость", 
    category: "Развитие",
    readTime: "7 мин",
    text: "Эмоциональная устойчивость — это способность адаптироваться к стрессовым ситуациям и восстанавливаться после трудностей.",
    sections: [
      {
        subtitle: "Что такое устойчивость?",
        content: "Эмоциональная устойчивость не означает отсутствие эмоций или проблем. Это способность проходить через трудности, сохраняя психологическое равновесие и способность функционировать."
      },
      {
        subtitle: "Факторы устойчивости",
        content: "К ключевым факторам относятся: поддерживающие отношения, реалистичное восприятие себя, навыки решения проблем, способность регулировать эмоции и вера в свои возможности."
      },
      {
        subtitle: "Развитие навыков",
        content: "Устойчивость можно развивать через практику осознанности, построение поддерживающих отношений, заботу о физическом здоровье и постановку реалистичных целей."
      }
    ]
  },
  "3": { 
    title: "Здоровые отношения", 
    category: "Отношения",
    readTime: "6 мин",
    text: "Построение и поддержание здоровых отношений требует осознанности, усилий и взаимного уважения.",
    sections: [
      {
        subtitle: "Основы здоровых отношений",
        content: "Здоровые отношения строятся на взаимном уважении, доверии, открытой коммуникации и поддержке. Каждый партнер сохраняет свою индивидуальность, при этом формируя прочную связь."
      },
      {
        subtitle: "Эффективная коммуникация",
        content: "Ключ к здоровым отношениям — умение слушать и выражать свои чувства и потребности ясно и с уважением. Важно создавать безопасное пространство для диалога."
      },
      {
        subtitle: "Разрешение конфликтов",
        content: "Конфликты неизбежны, но их можно решать конструктивно. Фокусируйтесь на проблеме, а не на личности, ищите компромиссы и готовность идти навстречу."
      }
    ]
  },
  "4": { 
    title: "Работа со стрессом", 
    category: "Стресс",
    readTime: "8 мин",
    text: "Стресс — неотъемлемая часть жизни, но им можно научиться управлять эффективно.",
    sections: [
      {
        subtitle: "Природа стресса",
        content: "Стресс возникает, когда требования ситуации превышают наши воспринимаемые ресурсы для ее преодоления. Он может быть как мотивирующим, так и разрушительным."
      },
      {
        subtitle: "Техники управления",
        content: "Эффективные стратегии включают: регулярную физическую активность, техники релаксации, управление временем, здоровый сон и социальную поддержку."
      },
      {
        subtitle: "Профилактика",
        content: "Важно развивать здоровые привычки до появления критического стресса: сбалансированное питание, достаточный отдых, хобби и качественное время с близкими."
      }
    ]
  },
  "5": { 
    title: "Самопознание", 
    category: "Личность",
    readTime: "10 мин",
    text: "Путь к пониманию себя — это непрерывный процесс исследования своих мыслей, чувств, ценностей и мотиваций.",
    sections: [
      {
        subtitle: "Зачем нужно самопознание?",
        content: "Глубокое понимание себя помогает принимать более осознанные решения, строить аутентичные отношения и жить в соответствии со своими истинными ценностями."
      },
      {
        subtitle: "Методы самоисследования",
        content: "Практики включают ведение дневника, медитацию, психотерапию, обратную связь от близких и исследование своих реакций в различных ситуациях."
      },
      {
        subtitle: "Преграды на пути",
        content: "Самопознание может быть болезненным, так как включает встречу с неприятными аспектами себя. Важно подходить к этому процессу с состраданием и терпением."
      }
    ]
  },
  "6": { 
    title: "Преодоление кризисов", 
    category: "Кризис",
    readTime: "9 мин",
    text: "Кризисные периоды — это возможность для роста и трансформации, хотя в моменте они ощущаются крайне тяжело.",
    sections: [
      {
        subtitle: "Понимание кризиса",
        content: "Кризис возникает, когда привычные способы справляться перестают работать. Это может быть потеря, изменение, травматическое событие или накопление стресса."
      },
      {
        subtitle: "Стадии преодоления",
        content: "Процесс включает: шок и отрицание, гнев и боль, принятие ситуации, адаптацию и, в конечном итоге, рост. Каждая стадия требует времени и поддержки."
      },
      {
        subtitle: "Ресурсы для восстановления",
        content: "Важно обращаться за профессиональной помощью, опираться на поддержку близких, заботиться о базовых потребностях и позволить себе время на исцеление."
      }
    ]
  }
};

export default function ArticleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const article = content[id] || content["1"];

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{article.category}</Text>
            </View>
            <Text style={styles.heroTitle}>{article.title}</Text>
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <MaterialCommunityIcons name="clock-outline" size={18} color="rgba(255, 255, 255, 0.9)" />
                <Text style={styles.metaText}>{article.readTime}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.contentSection}>
          <Text style={styles.introText}>{article.text}</Text>
          
          {article.sections.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.subtitle}</Text>
              <Text style={styles.sectionContent}>{section.content}</Text>
            </View>
          ))}
          
          <View style={styles.footerCard}>
            <MaterialCommunityIcons name="information-outline" size={32} color="#4A90A4" />
            <Text style={styles.footerText}>
              Если вам нужна профессиональная помощь, не стесняйтесь обращаться за консультацией.
            </Text>
          </View>
        </View>
      </ScrollView>
      </View>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  heroSection: {
    minHeight: height * 0.32,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  heroContent: {
    justifyContent: "center",
  },
  categoryBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
    lineHeight: 42,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaText: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.9)",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  contentSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  introText: {
    fontSize: 20,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.85)",
    lineHeight: 32,
    marginBottom: 36,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 14,
    lineHeight: 34,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 0.3,
  },
  sectionContent: {
    fontSize: 17,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 28,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  footerCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    padding: 24,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 18,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  footerText: {
    flex: 1,
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 26,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
});
