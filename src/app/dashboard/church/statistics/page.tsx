'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  FiBarChart2, 
  FiUsers, 
  FiHome, 
  FiTrendingUp, 
  FiRefreshCw,
  FiDownload,
  FiFilter
} from 'react-icons/fi';
import { HiOutlineUserGroup } from 'react-icons/hi2';
import { MdOutlineEvent } from 'react-icons/md';
import { RiBuilding2Line } from 'react-icons/ri';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/context/ToastContext';
import { churchService } from '@/lib/church-service';
import { personService } from '@/lib/person-service';
import { departmentService } from '@/lib/department-service';
import { lifeGroupApi } from '@/lib/lifegroup';
import Skeleton from '@/components/Skeleton';

interface StatisticCard {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

export default function ChurchStatisticsPage() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedChurch, setSelectedChurch] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('year');

  // Statistics state
  const [totalChurches, setTotalChurches] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalLifeGroups, setTotalLifeGroups] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState(0);

  // Chart data states
  const [provinceDistribution, setProvinceDistribution] = useState<ChartData[]>([]);
  const [departmentDistribution, setDepartmentDistribution] = useState<ChartData[]>([]);
  const [memberGrowth, setMemberGrowth] = useState<ChartData[]>([]);
  
  // Filter options
  const [churches, setChurches] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);

  useEffect(() => {
    fetchStatisticsData();
  }, [selectedProvince, selectedChurch, timeRange]);

  const fetchStatisticsData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch basic data
      const [churchesData, personsData, departmentsData, lifeGroupsData] = await Promise.all([
        churchService.getAll({ per_page: 1000 }),
        personService.getAll({ per_page: 1000 }),
        departmentService.getAll(),
        lifeGroupApi.getAll()
      ]);

      // Set basic statistics
      setTotalChurches(churchesData.count || churchesData.data.length);
      setTotalMembers(personsData.count || personsData.data.length);
      setTotalDepartments(departmentsData.length);
      setTotalLifeGroups(lifeGroupsData.length);

      // Extract provinces for filters
      const uniqueProvinces = [...new Set(churchesData.data.map(church => church.provinsi))];
      setProvinces(uniqueProvinces);
      setChurches(churchesData.data);

      // Generate province distribution data
      const provinceCount: { [key: string]: number } = {};
      churchesData.data.forEach(church => {
        provinceCount[church.provinsi] = (provinceCount[church.provinsi] || 0) + 1;
      });
      
      const provinceData = Object.entries(provinceCount).map(([name, value], index) => ({
        name,
        value,
        color: `hsl(${index * 45}, 70%, 50%)`
      }));
      setProvinceDistribution(provinceData);

      // Generate department distribution (mockup data for now)
      const deptData = departmentsData.map((dept, index) => ({
        name: dept.name,
        value: Math.floor(Math.random() * 50) + 10, // Mockup member count
        color: `hsl(${index * 60}, 65%, 55%)`
      }));
      setDepartmentDistribution(deptData);

      // Generate growth data (mockup)
      const growthData = Array.from({ length: 12 }, (_, i) => ({
        name: new Date(2024, i).toLocaleDateString('id-ID', { month: 'short' }),
        value: Math.floor(Math.random() * 30) + personsData.data.length * 0.8 + i * 5,
        color: '#3b82f6'
      }));
      setMemberGrowth(growthData);

    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      showToast('Gagal memuat data statistik.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchStatisticsData();
  };

  const handleExport = () => {
    showToast('Fitur export akan segera hadir!', 'info');
  };

  const statisticCards: StatisticCard[] = [
    {
      title: 'Total Gereja',
      value: totalChurches,
      icon: FiHome,
      color: 'bg-blue-500',
      trend: { value: 8.2, isPositive: true }
    },
    {
      title: 'Total Jemaat',
      value: totalMembers.toLocaleString('id-ID'),
      icon: FiUsers,
      color: 'bg-green-500',
      trend: { value: 12.5, isPositive: true }
    },
    {
      title: 'Life Group',
      value: totalLifeGroups,
      icon: HiOutlineUserGroup,
      color: 'bg-purple-500',
      trend: { value: 5.3, isPositive: true }
    },
    {
      title: 'Departemen',
      value: totalDepartments,
      icon: RiBuilding2Line,
      color: 'bg-orange-500',
      trend: { value: 0, isPositive: true }
    }
  ];

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <FeaturedCard
          title='Statistik Gereja'
          description='Analisis data gereja, jemaat, dan pelayanan secara interaktif.'
          actionLabel='Export Data'
          onAction={handleExport}
          gradientFrom='from-blue-500'
          gradientTo='to-indigo-500'
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border border-gray-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <FeaturedCard
        title='Statistik Gereja'
        description='Analisis data gereja, jemaat, dan pelayanan secara interaktif.'
        actionLabel='Export Data'
        onAction={handleExport}
        gradientFrom='from-blue-500'
        gradientTo='to-indigo-500'
      />

      {/* Filter Controls */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Filter Statistik</h2>
            <p className="text-sm text-gray-500 mt-1">Sesuaikan tampilan data berdasarkan filter yang dipilih</p>
          </div>
          <Button onClick={handleRefresh} variant="outline" disabled={isLoading}>
            <FiRefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}/>
            Refresh
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Provinsi</label>
            <Select value={selectedProvince} onValueChange={setSelectedProvince}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih provinsi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Provinsi</SelectItem>
                {provinces.map(province => (
                  <SelectItem key={province} value={province}>{province}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Gereja</label>
            <Select value={selectedChurch} onValueChange={setSelectedChurch}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih gereja" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Gereja</SelectItem>
                {churches
                  .filter(church => selectedProvince === 'all' || church.provinsi === selectedProvince)
                  .map(church => (
                    <SelectItem key={church.id} value={church.id}>{church.name}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Periode</label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Bulan Ini</SelectItem>
                <SelectItem value="quarter">Kuartal Ini</SelectItem>
                <SelectItem value="year">Tahun Ini</SelectItem>
                <SelectItem value="all">Sepanjang Masa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statisticCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    {stat.trend && (
                      <div className="flex items-center text-sm">
                        <FiTrendingUp className={`mr-1 h-4 w-4 ${stat.trend.isPositive ? 'text-green-500' : 'text-red-500'}`} />
                        <span className={`font-medium ${stat.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.trend.value > 0 ? '+' : ''}{stat.trend.value}%
                        </span>
                        <span className="text-gray-500 ml-1">vs bulan lalu</span>
                      </div>
                    )}
                  </div>
                  <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                    <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Province Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiBarChart2 className="h-5 w-5 text-blue-500" />
                Distribusi Gereja per Provinsi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {provinceDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${(item.value / Math.max(...provinceDistribution.map(p => p.value))) * 100}%`,
                            backgroundColor: item.color
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-8 text-right">
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Department Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RiBuilding2Line className="h-5 w-5 text-purple-500" />
                Distribusi Jemaat per Departemen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${(item.value / Math.max(...departmentDistribution.map(p => p.value))) * 100}%`,
                            backgroundColor: item.color
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-8 text-right">
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Growth Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiTrendingUp className="h-5 w-5 text-green-500" />
              Pertumbuhan Jemaat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>Jumlah Jemaat per Bulan (2024)</span>
                <span>Orang</span>
              </div>
              <div className="grid grid-cols-6 lg:grid-cols-12 gap-2">
                {memberGrowth.map((item) => (
                  <div key={item.name} className="flex flex-col items-center">
                    <div 
                      className="w-8 bg-blue-500 rounded-t"
                      style={{ 
                        height: `${(item.value / Math.max(...memberGrowth.map(p => p.value))) * 100}px`,
                        minHeight: '20px'
                      }}
                    />
                    <span className="text-xs text-gray-600 mt-2 rotate-45 origin-top-left">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Rata-rata per Life Group</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {totalLifeGroups > 0 ? Math.round(totalMembers / totalLifeGroups) : 0}
            </div>
            <p className="text-sm text-gray-500 mt-1">Jemaat per Life Group</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Gereja Terbesar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">
              {churches.length > 0 ? churches[0].name : 'N/A'}
            </div>
            <p className="text-sm text-gray-500 mt-1">{Math.floor(Math.random() * 200) + 100} jemaat</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Target Tahun Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-purple-600">
              {Math.round((totalMembers / (totalMembers + 50)) * 100)}%
            </div>
            <p className="text-sm text-gray-500 mt-1">Progress ke target 2024</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}