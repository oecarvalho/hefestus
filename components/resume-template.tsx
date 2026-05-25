import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 32,
    paddingHorizontal: 34,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.4,
    color: "#111827",
  },

  // HEADER

  header: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 12,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },

  contactContainer: {
    flexDirection: "column",
  },

  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },

  contact: {
    fontSize: 9,
    color: "#4B5563",
    marginRight: 14,
  },

  // SECTION

  section: {
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 6,
    color: "#2563EB",
    letterSpacing: 0.5,
  },

  text: {
    fontSize: 10,
    color: "#1F2937",
  },

  // EXPERIENCE

  item: {
    marginBottom: 10,
  },

  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },

  itemTitle: {
    fontSize: 10,
    fontWeight: "bold",
  },

  period: {
    fontSize: 9,
    color: "#6B7280",
  },

  company: {
    fontSize: 9,
    color: "#374151",
    marginBottom: 3,
  },

  description: {
    fontSize: 9.5,
    color: "#1F2937",
    lineHeight: 1.45,
  },

  // SKILLS

  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  skill: {
    fontSize: 9,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 4,
    backgroundColor: "#EFF6FF",
    color: "#1D4ED8",
    marginRight: 6,
    marginBottom: 6,
  },
});

interface ResumeData {
  summary: string;

  skills: string[];

  experiences: {
    enterpriseName: string;
    job: string;
    period: string;
    description: string;
  }[];

  projects: {
    projectName: string;
    projectDescription: string;
  }[];
}

interface ResumeTemplateProps {
  data: ResumeData;

  personalInfo: {
    name: string;
    email: string;
    phoneNumber: string;
    linkedin?: string;
    portfolio?: string;
  };
}

export function ResumeTemplate({
  data,
  personalInfo,
}: ResumeTemplateProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* HEADER */}

        <View style={styles.header}>

          <Text style={styles.name}>
            {personalInfo.name}
          </Text>

          <View style={styles.contactContainer}>

            <View style={styles.contactRow}>

              <Text style={styles.contact}>
                {personalInfo.email}
              </Text>

              <Text style={styles.contact}>
                {personalInfo.phoneNumber}
              </Text>

            </View>

            <View style={styles.contactRow}>

              {personalInfo.linkedin && (
                <Text style={styles.contact}>
                  {personalInfo.linkedin}
                </Text>
              )}

              {personalInfo.portfolio && (
                <Text style={styles.contact}>
                  {personalInfo.portfolio}
                </Text>
              )}

            </View>

          </View>

        </View>

        {/* SUMMARY */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Resumo Profissional
          </Text>

          <Text style={styles.text}>
            {data.summary}
          </Text>

        </View>

        {/* SKILLS */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Competências Técnicas
          </Text>

          <View style={styles.skillsContainer}>
            {data.skills.map((skill) => (
              <Text key={skill} style={styles.skill}>
                {skill}
              </Text>
            ))}
          </View>

        </View>

        {/* EXPERIENCE */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Experiência Profissional
          </Text>

          {data.experiences.map((exp) => (
            <View key={exp.enterpriseName} style={styles.item}>

              <View style={styles.itemHeader}>

                <Text style={styles.itemTitle}>
                  {exp.job}
                </Text>

                <Text style={styles.period}>
                  {exp.period}
                </Text>

              </View>

              <Text style={styles.company}>
                {exp.enterpriseName}
              </Text>

              <Text style={styles.description}>
                {exp.description}
              </Text>

            </View>
          ))}

        </View>

        {/* PROJECTS */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Projetos
          </Text>

          {data.projects.map((project) => (
            <View key={project.projectName} style={styles.item}>

              <Text style={styles.itemTitle}>
                {project.projectName}
              </Text>

              <Text style={styles.description}>
                {project.projectDescription}
              </Text>

            </View>
          ))}

        </View>

      </Page>
    </Document>
  );
}