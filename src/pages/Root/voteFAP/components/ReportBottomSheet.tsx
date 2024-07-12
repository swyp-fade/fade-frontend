import { AnimatedDialog } from '@Components/AnimatedDialog';
import { DialogOverlay } from '@Components/DialogOverlay';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { cn } from '@Utils/index';
import { AnimatePresence } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

const enum ReportType {
  PORNO_OR_SEXUAL_IMAGE = 'PORNO_OR_SEXUAL_IMAGE',
  ILLEGAL_USE_OR_AI_IMAGE = 'ILLEGAL_USE_OR_AI_IMAGE',
  REPUGNANT_SYMBOL = 'REPUGNANT_SYMBOL',
  OTHER = 'OTHER',
}

const REPORT_TYPE_TEXT: Record<ReportType, string> = {
  PORNO_OR_SEXUAL_IMAGE: '음란물 또는 성적인 사진',
  ILLEGAL_USE_OR_AI_IMAGE: '도용 또는 AI 이미지',
  REPUGNANT_SYMBOL: '혐오 발언 또는 상징',
  OTHER: '기타',
};

const reportTypeList: ReportType[] = [ReportType.PORNO_OR_SEXUAL_IMAGE, ReportType.ILLEGAL_USE_OR_AI_IMAGE, ReportType.REPUGNANT_SYMBOL, ReportType.OTHER];

type ReportBottomSheetProp = {
  triggerSlot: ReactNode;
};

export function ReportBottomSheet({ triggerSlot }: ReportBottomSheetProp) {
  const [isOpened, setIsOpened] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<ReportType | null>(null);

  const [currentStep, setCurrentStep] = useState(0);

  const isSelectStep = currentStep === 0;
  const isInputStep = currentStep === 1;

  const closeSheet = () => setIsOpened(false);

  const changeStep = (newStep: number) => {
    setCurrentStep(newStep);
  };

  const handleSelect = (selectType: ReportType) => {
    setSelectedReportType(selectType);
    changeStep(1);
  };

  return (
    <AlertDialog.Root open={isOpened} onOpenChange={setIsOpened}>
      {triggerSlot && <AlertDialog.Trigger asChild>{triggerSlot}</AlertDialog.Trigger>}

      <AnimatePresence onExitComplete={() => changeStep(0)}>
        {isOpened && (
          <AlertDialog.Portal forceMount container={document.getElementById('portalSection')!}>
            <AlertDialog.Overlay>
              <DialogOverlay onClick={() => closeSheet()} />
            </AlertDialog.Overlay>

            <AlertDialog.Title />

            <AlertDialog.Content>
              <VisuallyHidden>
                <AlertDialog.AlertDialogDescription>This description is hidden from sighted users but accessible to screen readers.</AlertDialog.AlertDialogDescription>
              </VisuallyHidden>

              <AnimatedDialog modalType="bottomSheet">
                <FlexibleLayout.Root className="h-fit">
                  <FlexibleLayout.Header>
                    <header className="relative px-5 py-4">
                      {isInputStep && (
                        <button
                          type="button"
                          className="group absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-2 pointerdevice:hover:bg-gray-100"
                          onClick={() => changeStep(0)}>
                          <MdChevronLeft className="size-6 group-active:pointerdevice:scale-95" />
                        </button>
                      )}
                      <p className="text-center text-2xl font-semibold">신고</p>
                    </header>
                  </FlexibleLayout.Header>

                  <FlexibleLayout.Content className={cn('p-0', { ['p-5']: isInputStep })}>
                    {isSelectStep && <SelectReportTypeList onSelect={handleSelect} />}
                    {isInputStep && <InputReportDetail reportType={selectedReportType!} />}
                  </FlexibleLayout.Content>

                  <FlexibleLayout.Footer>
                    {isInputStep && (
                      <div className="flex p-4">
                        <button type="button" className="flex-1 rounded-lg bg-pink-600 py-2 text-xl text-white transition-colors" onClick={() => closeSheet()}>
                          신고하기
                        </button>
                      </div>
                    )}
                  </FlexibleLayout.Footer>
                </FlexibleLayout.Root>
              </AnimatedDialog>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        )}
      </AnimatePresence>
    </AlertDialog.Root>
  );
}

function SelectReportTypeList({ onSelect }: { onSelect: (selectType: ReportType) => void }) {
  return (
    <ul className="divide-y">
      {reportTypeList.map((reportType) => (
        <li key={reportType} onClick={() => onSelect(reportType)}>
          <button className="relative w-full p-5">
            <p className="text-left">{REPORT_TYPE_TEXT[reportType]}</p>
            <MdChevronRight className="absolute right-5 top-1/2 size-6 -translate-y-1/2 text-gray-500" />
          </button>
        </li>
      ))}
    </ul>
  );
}

function InputReportDetail({ reportType }: { reportType: ReportType }) {
  return (
    <div>
      <p className="mb-2 font-semibold">{REPORT_TYPE_TEXT[reportType]}</p>
      <textarea className="h-[10rem] w-full resize-none rounded-lg bg-gray-100 p-5" placeholder="신고 내용을 입력해주세요." />
      <p className="text-xs text-gray-500">※ 신고한 사진은 회원님의 피드에 더이상 노출되지 않습니다.</p>
      <p className="text-xs text-gray-500">※ 신고 5회 누적 시 사진이 삭제됩니다.</p>
    </div>
  );
}
