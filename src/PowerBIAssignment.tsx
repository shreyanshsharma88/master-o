/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Fab,
  Alert,
  LinearProgress,
  Avatar,
  Divider,
  Container,
} from "@mui/material";
import {
  BarChart,
  FilterList,
  Add,
  Close,
  Visibility,
  Description,
  TrendingUp,
  Analytics,
  Dashboard,
  GetApp,
} from "@mui/icons-material";

// Define types
interface Metric {
  id: string;
  name: string;
  type: "identifier" | "date" | "category" | "status" | "numeric" | "time";
  filters: string[];
}

interface ReportData {
  [key: string]: string | number;
}

interface ActiveFilters {
  [metricId: string]: {
    [filterType: string]: boolean;
  };
}

// Simulated framer-motion components with CSS animations
const MotionCard = ({ children, delay = 0, ...props }: any) => (
  <Card
    {...props}
    sx={{
      ...props.sx,
      animation: `slideInUp 0.6s ease-out ${delay}s both`,
      "@keyframes slideInUp": {
        "0%": { transform: "translateY(50px)", opacity: 0 },
        "100%": { transform: "translateY(0)", opacity: 1 },
      },
    }}
  >
    {children}
  </Card>
);

const MotionBox = ({ children, delay = 0, ...props }: any) => (
  <Box
    {...props}
    sx={{
      ...props.sx,
      animation: `fadeInScale 0.5s ease-out ${delay}s both`,
      "@keyframes fadeInScale": {
        "0%": { transform: "scale(0.8)", opacity: 0 },
        "100%": { transform: "scale(1)", opacity: 1 },
      },
    }}
  >
    {children}
  </Box>
);

const PulseBox = ({ children, ...props }: any) => (
  <Box
    {...props}
    sx={{
      ...props.sx,
      animation: "pulse 2s infinite",
      "@keyframes pulse": {
        "0%": { transform: "scale(1)" },
        "50%": { transform: "scale(1.05)" },
        "100%": { transform: "scale(1)" },
      },
    }}
  >
    {children}
  </Box>
);

export const CustomReportsUI: React.FC = () => {
  const [selectedMetrics, setSelectedMetrics] = useState<Metric[]>([]);
  const [reportData, setReportData] = useState<ReportData[] | null>(null);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [showDashboard, setShowDashboard] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Available metrics based on the assignment table
  const availableMetrics: Metric[] = [
    {
      id: "master-id",
      name: "Master-O ID",
      type: "identifier",
      filters: ["Count", "Distinct Count", "Distinct Value"],
    },
    {
      id: "content-launch-date",
      name: "Content Launch Date",
      type: "date",
      filters: ["Date Range", "Specific Date"],
    },
    {
      id: "challenges",
      name: "Challenges",
      type: "category",
      filters: ["Status"],
    },
    {
      id: "completion-status",
      name: "Completion Status",
      type: "status",
      filters: [
        "Status Count",
        "Status Percentage",
        "Less than",
        "Greater than",
        "Range",
      ],
    },
    {
      id: "completion-date",
      name: "Completion Date",
      type: "date",
      filters: ["Date Range", "Specific Date"],
    },
    {
      id: "completed-days",
      name: "Completed In Days",
      type: "numeric",
      filters: ["Count", "Less than", "Greater than"],
    },
    {
      id: "attempts",
      name: "Attempts",
      type: "numeric",
      filters: ["Status Count"],
    },
    {
      id: "score",
      name: "Score",
      type: "numeric",
      filters: ["Count", "Average", "Percentage"],
    },
    {
      id: "max-score",
      name: "Max Score",
      type: "numeric",
      filters: ["Count"],
    },
    {
      id: "time-spent",
      name: "Time Spent",
      type: "time",
      filters: ["Time Value", "Average"],
    },
    {
      id: "microskill-name",
      name: "Microskill Name",
      type: "category",
      filters: ["Count", "Distinct Count", "Distinct Value"],
    },
    {
      id: "login-status",
      name: "Login Status",
      type: "status",
      filters: ["Status Count"],
    },
    {
      id: "last-login-date",
      name: "Last Login Date",
      type: "date",
      filters: ["Date Range", "Specific Date"],
    },
  ];

  // Generate sample data based on selected metrics
  const generateSampleData = (): ReportData[] => {
    const sampleData: ReportData[] = [];
    for (let i = 0; i < 50; i++) {
      const row: ReportData = {};
      selectedMetrics.forEach((metric: Metric) => {
        switch (metric.type) {
          case "identifier":
            row[metric.id] = `ID-${1000 + i}`;
            break;
          case "date":
            row[metric.id] = new Date(
              2024,
              Math.floor(Math.random() * 12),
              Math.floor(Math.random() * 28) + 1
            ).toLocaleDateString();
            break;
          case "status":
            row[metric.id] = ["Completed", "In Progress", "Not Started"][
              Math.floor(Math.random() * 3)
            ];
            break;
          case "numeric":
            row[metric.id] = Math.floor(Math.random() * 100) + 1;
            break;
          case "time":
            row[metric.id] = `${Math.floor(Math.random() * 120) + 1} mins`;
            break;
          case "category":
            row[metric.id] = ["Category A", "Category B", "Category C"][
              Math.floor(Math.random() * 3)
            ];
            break;
          default:
            row[metric.id] = `Value ${i + 1}`;
        }
      });
      sampleData.push(row);
    }
    return sampleData;
  };

  const handleMetricSelect = (metric: Metric): void => {
    if (selectedMetrics.find((m) => m.id === metric.id)) {
      setSelectedMetrics(selectedMetrics.filter((m) => m.id !== metric.id));
    } else {
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };

  const handleFilterChange = (
    metricId: string,
    filterType: string,
    value: boolean
  ): void => {
    setActiveFilters({
      ...activeFilters,
      [metricId]: { ...activeFilters[metricId], [filterType]: value },
    });
  };

  const generateReport = async (): Promise<void> => {
    setIsGenerating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const data = generateSampleData();
    setReportData(data);
    setShowDashboard(true);
    setIsGenerating(false);
  };

  const exportToCSV = (): void => {
    if (!reportData || reportData.length === 0) return;

    const headers = selectedMetrics.map((m) => m.name).join(",");
    const csvContent = [
      headers,
      ...reportData.map((row) =>
        selectedMetrics.map((metric) => row[metric.id] || "").join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "custom_report.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getMetricIcon = (type: string): string => {
    switch (type) {
      case "date":
        return "📅";
      case "numeric":
        return "🔢";
      case "status":
        return "🔄";
      case "time":
        return "⏱️";
      case "category":
        return "📂";
      default:
        return "📊";
    }
  };

  const getChipColor = (
    type: string
  ): "primary" | "secondary" | "success" | "warning" | "info" => {
    switch (type) {
      case "date":
        return "primary";
      case "numeric":
        return "success";
      case "status":
        return "warning";
      case "time":
        return "info";
      case "category":
        return "secondary";
      default:
        return "primary";
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      {/* Header */}
      <MotionCard
        elevation={3}
        sx={{
          mb: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <CardContent sx={{ py: 4 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <PulseBox>
              <Avatar
                sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 56, height: 56 }}
              >
                <Dashboard fontSize="large" />
              </Avatar>
            </PulseBox>
            <Box>
              <Typography variant="h3" component="h1" fontWeight="bold">
                Custom Reports Dashboard
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
                Select metrics to generate custom reports and export data
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </MotionCard>

      <Grid container spacing={4}>
        {/* Metrics Selection Panel */}
        <Grid
          columns={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 3,
            xl: 2,
          }}
        >
          <MotionCard elevation={2} delay={0.1}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Avatar sx={{ bgcolor: "success.main" }}>
                  <Add />
                </Avatar>
                <Typography variant="h5" fontWeight="bold">
                  Available Metrics ({availableMetrics.length})
                </Typography>
              </Box>

              <Box sx={{ maxHeight: 400, overflowY: "auto", pr: 1 }}>
                {availableMetrics.map((metric, index) => (
                  <MotionBox key={metric.id} delay={index * 0.05}>
                    <Card
                      sx={{
                        mb: 2,
                        cursor: "pointer",
                        border: selectedMetrics.find((m) => m.id === metric.id)
                          ? 2
                          : 1,
                        borderColor: selectedMetrics.find(
                          (m) => m.id === metric.id
                        )
                          ? "primary.main"
                          : "grey.300",
                        bgcolor: selectedMetrics.find((m) => m.id === metric.id)
                          ? "primary.50"
                          : "white",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: 4,
                        },
                      }}
                      onClick={() => handleMetricSelect(metric)}
                    >
                      <CardContent sx={{ py: 2 }}>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="h6">
                              {getMetricIcon(metric.type)}
                            </Typography>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {metric.name}
                            </Typography>
                          </Box>
                          {selectedMetrics.find((m) => m.id === metric.id) && (
                            <Avatar
                              sx={{
                                bgcolor: "primary.main",
                                width: 24,
                                height: 24,
                              }}
                            >
                              <Typography variant="caption" color="white">
                                ✓
                              </Typography>
                            </Avatar>
                          )}
                        </Box>
                        <Box display="flex" gap={1} mt={1}>
                          <Chip
                            label={metric.type}
                            size="small"
                            color={getChipColor(metric.type)}
                            variant="outlined"
                          />
                          <Chip
                            label={`${metric.filters.length} filters`}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </MotionBox>
                ))}
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>

        {/* Selected Metrics and Filters */}
        <Grid
          columns={{
            xs: 12,
            sm: 6,
            md: 8,
            lg: 9,
            xl: 10,
          }}
        >
          <MotionCard elevation={2} delay={0.2}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Avatar sx={{ bgcolor: "info.main" }}>
                  <FilterList />
                </Avatar>
                <Typography variant="h5" fontWeight="bold">
                  Selected Metrics ({selectedMetrics.length})
                </Typography>
              </Box>

              {selectedMetrics.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <Description
                    sx={{ fontSize: 80, color: "grey.300", mb: 2 }}
                  />
                  <Typography variant="h6" color="textSecondary">
                    No metrics selected
                  </Typography>
                  <Typography color="textSecondary">
                    Choose metrics from the left panel to get started
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {selectedMetrics.map((metric, index) => (
                    <MotionBox key={metric.id} delay={index * 0.1}>
                      <Card sx={{ mb: 3, border: 1, borderColor: "grey.200" }}>
                        <CardContent>
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            mb={2}
                          >
                            <Box display="flex" alignItems="center" gap={2}>
                              <Typography variant="h6">
                                {getMetricIcon(metric.type)}
                              </Typography>
                              <Typography variant="h6" fontWeight="bold">
                                {metric.name}
                              </Typography>
                              <Chip
                                label={metric.type}
                                size="small"
                                color={getChipColor(metric.type)}
                              />
                            </Box>
                            <IconButton
                              onClick={() => handleMetricSelect(metric)}
                              color="error"
                              size="small"
                            >
                              <Close />
                            </IconButton>
                          </Box>

                          <Divider sx={{ my: 2 }} />

                          <Grid container spacing={1}>
                            {metric.filters.map((filter) => (
                              <Grid
                                columns={{
                                  xs: 12,
                                  sm: 6,
                                  md: 4,
                                }}
                                key={filter}
                              >
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      size="small"
                                      onChange={(e) =>
                                        handleFilterChange(
                                          metric.id,
                                          filter,
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label={
                                    <Typography variant="body2">
                                      {filter}
                                    </Typography>
                                  }
                                />
                              </Grid>
                            ))}
                          </Grid>
                        </CardContent>
                      </Card>
                    </MotionBox>
                  ))}
                </Box>
              )}
            </CardContent>
          </MotionCard>

          {/* Action Buttons */}
          <MotionBox delay={0.3}>
            <Box display="flex" gap={2} mt={3}>
              <Button
                variant="contained"
                size="medium"
                startIcon={isGenerating ? null : <BarChart />}
                onClick={generateReport}
                disabled={selectedMetrics.length === 0 || isGenerating}
                sx={{
                  py: 2,
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #1976D2 30%, #0288D1 90%)",
                  },
                }}
              >
                {isGenerating ? "Generating..." : "Generate Report"}
              </Button>

              <Button
                variant="outlined"
                color="success"
                size="medium"
                startIcon={<Visibility />}
                onClick={() => setShowDashboard(!showDashboard)}
                disabled={!reportData}
                sx={{ py: 2, minWidth: 150 }}
              >
                {showDashboard ? "Hide" : "View"} Dashboard
              </Button>

              <Button
                variant="text"
                color="secondary"
                size="medium"
                startIcon={<GetApp />}
                onClick={exportToCSV}
                disabled={!reportData}
                sx={{ py: 2, minWidth: 140 }}
              >
                Export CSV
              </Button>
            </Box>
          </MotionBox>

          {/* Loading Progress */}
          {isGenerating && (
            <MotionBox sx={{ mt: 2 }}>
              <LinearProgress
                sx={{
                  height: 8,
                  borderRadius: 4,
                  background:
                    "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                }}
              />
              <Typography
                variant="body2"
                color="textSecondary"
                textAlign="center"
                sx={{ mt: 1 }}
              >
                Processing your custom report...
              </Typography>
            </MotionBox>
          )}
        </Grid>
      </Grid>

      {/* Dashboard View */}
      {showDashboard && reportData && (
        <MotionCard elevation={3} sx={{ mt: 4 }} delay={0.4}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} mb={4}>
              <Avatar sx={{ bgcolor: "primary.main" }}>
                <Analytics />
              </Avatar>
              <Typography variant="h4" fontWeight="bold">
                Report Dashboard
              </Typography>
            </Box>

            {/* Summary Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                {
                  label: "Total Records",
                  value: reportData.length,
                  color: "primary",
                  icon: "📊",
                },
                {
                  label: "Selected Metrics",
                  value: selectedMetrics.length,
                  color: "success",
                  icon: "📈",
                },
                {
                  label: "Active Filters",
                  value: Object.keys(activeFilters).length,
                  color: "info",
                  icon: "🔍",
                },
                {
                  label: "Data Completeness",
                  value: "100%",
                  color: "warning",
                  icon: "✅",
                },
              ].map((stat, index) => (
                <Grid
                  columns={{
                    xs: 12,
                    sm: 6,
                    md: 4,
                  }}
                  key={stat.label}
                >
                  <MotionBox delay={0.1 * index}>
                    <Card
                      sx={{
                        textAlign: "center",
                        background: `linear-gradient(135deg, ${
                          stat.color === "primary"
                            ? "#1976d2"
                            : stat.color === "success"
                            ? "#388e3c"
                            : stat.color === "info"
                            ? "#0288d1"
                            : "#f57c00"
                        }15, ${
                          stat.color === "primary"
                            ? "#1976d2"
                            : stat.color === "success"
                            ? "#388e3c"
                            : stat.color === "info"
                            ? "#0288d1"
                            : "#f57c00"
                        }05)`,
                        border: `1px solid ${
                          stat.color === "primary"
                            ? "#1976d2"
                            : stat.color === "success"
                            ? "#388e3c"
                            : stat.color === "info"
                            ? "#0288d1"
                            : "#f57c00"
                        }20`,
                      }}
                    >
                      <CardContent>
                        <Typography variant="h4" sx={{ mb: 1 }}>
                          {stat.icon}
                        </Typography>
                        <Typography
                          variant="h3"
                          fontWeight="bold"
                          color={`${stat.color}.main`}
                        >
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {stat.label}
                        </Typography>
                      </CardContent>
                    </Card>
                  </MotionBox>
                </Grid>
              ))}
            </Grid>

            {/* Data Table */}
            <TableContainer component={Paper} elevation={1}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.100" }}>
                    {selectedMetrics.map((metric) => (
                      <TableCell key={metric.id} sx={{ fontWeight: "bold" }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography>{getMetricIcon(metric.type)}</Typography>
                          {metric.name}
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.slice(0, 10).map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:hover": { bgcolor: "grey.50" },
                        animation: `slideInLeft 0.5s ease-out ${
                          index * 0.05
                        }s both`,
                        "@keyframes slideInLeft": {
                          "0%": { transform: "translateX(-20px)", opacity: 0 },
                          "100%": { transform: "translateX(0)", opacity: 1 },
                        },
                      }}
                    >
                      {selectedMetrics.map((metric) => (
                        <TableCell key={metric.id}>{row[metric.id]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {reportData.length > 10 && (
              <Typography
                textAlign="center"
                sx={{ mt: 2 }}
                color="textSecondary"
              >
                ... and {reportData.length - 10} more records
              </Typography>
            )}

            {/* Power BI Integration */}
            <Alert
              severity="info"
              sx={{
                mt: 4,
                background: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
                border: "1px solid #ffb74d",
              }}
              icon={<TrendingUp />}
            >
              <Typography variant="h6" gutterBottom>
                🔗 Power BI Integration
              </Typography>
              <Typography>
                This report can be integrated with Power BI for advanced
                analytics and visualization. The selected metrics and filters
                would be passed to Power BI API for real-time dashboard
                creation.
              </Typography>
            </Alert>
          </CardContent>
        </MotionCard>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
          "&:hover": {
            background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
            transform: "scale(1.1)",
          },
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <TrendingUp />
      </Fab>
    </Container>
  );
};
