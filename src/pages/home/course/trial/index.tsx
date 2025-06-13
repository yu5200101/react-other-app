import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProFormRadio,
  ProFormCheckbox,
  ProFormText,
  StepsForm,
} from '@ant-design/pro-components';
import { message } from 'antd';
import { useRef } from 'react';
import { sleepTime } from '@/utils/tools'

export default () => {
  const formRef = useRef<ProFormInstance>(null);

  return (
    <>
      <StepsForm<{
        name: string;
      }>
        formRef={formRef}
        onFinish={async () => {
          await sleepTime(1000);
          message.success('提交成功');
        }}
        formProps={{
          validateMessages: {
            required: '此项为必填项',
          },
        }}
      >
        <StepsForm.StepForm<{
          name: string;
        }>
          name="base"
          title="一、单选题"
          stepProps={{
            description: '描述',
          }}
          onFinish={async () => {
            console.log(formRef.current?.getFieldsValue());
            await sleepTime(2000);
            return true;
          }}
        >
          <ProFormRadio.Group
            name="radio-vertical"
            layout="vertical"
            label=" Powerblade系列测量机的准正控制器不具备以下哪种功能？"
            options={[
              {
                label: '答案1',
                value: 'A',
              },
              {
                label: '答案2',
                value: 'B',
              },
              {
                label: '答案3',
                value: 'C',
              },
              {
                label: '答案4',
                value: 'D',
              },
            ]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm<{
          checkbox: string;
        }>
          name="checkbox"
          title="多选题"
          stepProps={{
            description: '描述'
          }}
          onFinish={async () => {
            console.log(formRef.current?.getFieldsValue());
            return true;
          }}
        >
          <ProFormCheckbox.Group
            name="checkbox"
            layout="vertical"
            label="Powerblade系列测量机的核心组成部分包括？"
            width="lg"
            options={[
              {
                label: '答案1',
                value: 'A',
              },
              {
                label: '答案2',
                value: 'B',
              },
              {
                label: '答案3',
                value: 'C',
              },
              {
                label: '答案4',
                value: 'D',
              },
            ]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm
          name="time"
          title="填空题"
          stepProps={{
            description: '描述'
          }}
        >
          <ProFormText
            name="name"
            label="测头补偿的原理是将测针球心坐标沿________方向补偿测针半径，得到工件实际表面坐标。"
            width="md"
            tooltip="提示文案"
            placeholder="请输入名称"
            rules={[{ required: true }]}
          />
        </StepsForm.StepForm>
      </StepsForm>
    </>
  );
};