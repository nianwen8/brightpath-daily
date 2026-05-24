import { ResultsView } from "@/components/results-view";

export default async function ResultsPage({ params }: { params: Promise<{ submissionId: string }> }) {
  const { submissionId } = await params;
  return <ResultsView submissionId={submissionId} />;
}
